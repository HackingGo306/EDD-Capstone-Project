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

      let expiration = 60;
      if (breakType == "water") {
        expiration = 600;
      }

      await redisClient.set(`break:${userId}`, breakData, "EX", expiration);
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

Router.post('/end', async (req, res) => { // TODO: handle water breaks that have a drankAmount parameter instead of using duration
  autoSignin(req, res, async (userId) => {
    try {
      const breakData = await redisClient.get(`break:${userId}`);
      console.log("Break data:", breakData);

      if (!breakData) {
        return res.status(400).send({
          success: false,
        });
      }

      const { type, timestamp } = JSON.parse(breakData);

      let duration = Math.floor((Date.now() / 1000) - timestamp);

      if (type == "water") {
        let drankAmount = req.body.drankAmount ?? 1;
        if (!Number.isFinite(drankAmount)) {
          return res.status(400).send({
            success: false,
            message: "Invalid water amount"
          });
        }
        drankAmount = Math.max(1, Math.min(10, drankAmount));
        duration = drankAmount;
      }

      const connection = pool.promise();
      const [result] = await connection.query(`INSERT INTO activities (user_id, type, time, timestamp) VALUES (?, ?, ?, ?)`, [userId, type, duration, timestamp]);

      await redisClient.del(`break:${userId}`);

      // Get current user pet
      let petEvolution = false;
      let xpEarned = Math.min(10, Math.floor(duration / 20 * 3));
      if (type == "water") {
        xpEarned = Math.min(10, duration);
      }
      const [pet] = await connection.query(`SELECT pet FROM users WHERE user_id = ?`, [userId]);
      const petId = pet[0].pet;
      const [oldPetData] = await connection.query(`SELECT xp, water, energy, level FROM pets WHERE pet_id = ?`, [petId]);

      // Add to pet energy
      let newEnergy = 0;
      let newWater = oldPetData[0].water;
      if (type == "water") {
        newEnergy = Math.min(100, oldPetData[0].energy + 5);
        newWater = Math.min(100, oldPetData[0].water + 10);
      }
      if (type == "eye") newEnergy = Math.min(100, oldPetData[0].energy + 3);
      if (type == "stretch") newEnergy = Math.min(100, oldPetData[0].energy + 10);

      // Update pet xp
      let newXP = oldPetData[0].xp + xpEarned;
      const level = oldPetData[0].level ?? 0;
      let thresholdLevels = [10, 90, 300, 750, 1500];
      const threshold = thresholdLevels[level];
      if (newXP >= threshold) {
        await connection.query(`UPDATE pets SET level = level + 1 WHERE pet_id = ?`, [petId]);
        newXP = newXP - threshold;
        petEvolution = true;
      }
      await connection.query('UPDATE pets SET xp = ?, energy = ?, water = ? WHERE pet_id = ?', [newXP, newEnergy, newWater, petId]);

      res.status(200).send({
        success: true,
        status: 200,
        data: { petEvolution },
      })
    }
    catch (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        status: 500,
        message: "Unexpected error",
        error: { reason: "Unexpected error" },
      });
    }
  });
});

Router.post('/skip', async (req, res) => {
  autoSignin(req, res, async (userId) => {
    try {
      const type = req.body.type;
      if (type != "eye" && type != "water" && type != "stretch") {
        return res.status(400).send({
          success: false,
          message: "Invalid break type"
        });
      }

      const connection = pool.promise();

      const [pet] = await connection.query(`SELECT pet FROM users WHERE user_id = ?`, [userId]);
      const petId = pet[0].pet;
      const [oldPetData] = await connection.query(`SELECT xp, water, energy, level FROM pets WHERE pet_id = ?`, [petId]);

      // Subtract pet energy
      let newEnergy = oldPetData[0].energy - 5;
      let newWater = oldPetData[0].water;
      if (type == "water") {
        newWater = oldPetData[0].water - 5;
      }

      if (newEnergy < 0 || newWater < 0) {
        // Set pet xp to zero
        await connection.query('UPDATE pets SET xp = 0 WHERE pet_id = ?', [petId]);
        newEnergy = 50;
        newWater = 50;
        await connection.query('UPDATE pets SET energy = ?, water = ? WHERE pet_id = ?', [newEnergy, newWater, petId]);

        return res.status(200).send({
          success: true,
          status: 200,
          data: { petFainted: true }
        });
      }

      await connection.query('UPDATE pets SET energy = ?, water = ? WHERE pet_id = ?', [newEnergy, newWater, petId]);
    }
    catch (err) {
      console.log(err);
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