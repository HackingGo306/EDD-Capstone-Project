const express = require("express");
const Router = express.Router();
const pool = require("../model/pool");
const { autoSignin } = require('./auth');
const redisClient = require("../model/redis");

Router.get("/", async (req, res) => {
  autoSignin(req, res, async (userId) => {
    try {

      const connection = pool.promise();
      const [userInfo] = await connection.query(`SELECT activity_id, type, time, timestamp FROM activities WHERE user_id = ?`, [userId]);

      res.status(200).send({
        success: true,
        status: 200,
        data: userInfo,
      })
    }
    catch (err) {
      console.log("Fetching User Info Error:", err);
      return res.status(500).send({
        success: false,
        status: 500,
        message: "Unexpected error",
        error: { reason: "Unexpected error" },
      });
    }
  })
});

Router.post('/begin', async (req, res) => {
  autoSignin(req, res, async (userId) => {
    try {
      const breakType = req.body.type;
      const now = Math.floor(Date.now() / 1000);

      if (breakType != "eye" && breakType != "water" && breakType != "stretch") {
        return res.status(400).send({
          success: false,
          message: "Invalid break type"
        });
      }

      const breakData = JSON.stringify({
        type: breakType,
        timestamp: now,
      });

      await redisClient.set(`break:${userId}`, breakData, "EX", 60);
    }
    catch (err) {
      return res.status(500).send({
        success: false,
        status: 500,
        message: "Unexpected error",
        error: { reason: "Unexpected error" },
      });
    }
  });
});

Router.post('/end', async (req, res) => {
  autoSignin(req, res, async (userId) => {
    try {
      const breakData = await redisClient.get(`break:${userId}`);

      if (!breakData) {
        return res.status(400).send({
          success: false,
        });
      }

      const { type, timestamp } = JSON.parse(breakData);

      const duration = Math.floor((Date.now() / 1000) - timestamp);

      const connection = pool.promise();
      const [result] = await connection.query(`INSERT INTO activities (user_id, type, time, timestamp) VALUES (?, ?, ?, ?)`, [userId, type, duration, timestamp]);

      await redisClient.del(`break:${userId}`);

      // Update pet xp
      let petEvolution = false;
      const xpEarned = Math.min(10, Math.floor(duration / 20 * 3));
      const [pet] = await connection.query(`SELECT pet FROM users WHERE user_id = ?`, [userId]);
      const petId = pet[0].pet;
      const [oldXP] = await connection.query(`SELECT xp, level FROM pets WHERE pet_id = ?`, [petId]);
      let newXP = oldXP[0].xp + xpEarned;
      const level = oldXP[0].level ?? 0;
      let thresholdLevels = [10, 90, 300, 750, 1500];
      const threshold = thresholdLevels[level];
      if (newXP >= threshold) {
        await connection.query(`UPDATE pets SET level = level + 1 WHERE pet_id = ?`, [petId]);
        newXP = newXP - threshold;
        petEvolution = true;
      }
      await connection.query('UPDATE pets SET xp = ? WHERE pet_id = ?', [newXP, petId]);

      res.status(200).send({
        success: true,
        status: 200,
        data: { petEvolution },
      })
    }
    catch (err) {
      return res.status(500).send({
        success: false,
        status: 500,
        message: "Unexpected error",
        error: { reason: "Unexpected error" },
      });
    }
  });
});

module.exports = {
  Router,
};