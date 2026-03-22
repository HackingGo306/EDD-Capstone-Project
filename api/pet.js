const express = require("express");
const Router = express.Router();
const pool = require("../model/pool");
const { autoSignin } = require('./auth');
const generateRandomId = require("../utils/security").generateRandomId;

Router.post("/choose", async (req, res) => {
  autoSignin(req, res, async (userId) => {
    try {
      const { pet } = req.body;

      if (pet != "cat" && pet != "dog" && pet != "fly" && pet != "human") {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Invalid pet",
          error: { reason: "Invalid pet" },
        });
      }

      if (!pet) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Missing pet",
          error: { reason: "Missing pet" },
        });
      }

      const connection = pool.promise();
      const [currentPet] = await connection.query(
        "SELECT pet FROM users WHERE user_id = ?",
        [userId]
      )

      if (currentPet[0].pet != null) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Pet already chosen",
          error: { reason: "Pet already chosen" },
        });
      }

      // Create a new pet in the pet table
      const petId = generateRandomId(10);
      await connection.query(
        "INSERT INTO pets (pet_id, user_id, name, type, water, energy, xp, level created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [petId, userId, "Unnamed", pet, 50, 50, 0, 1, Math.floor(Date.now() / 1000)]
      );

      await connection.query(
        "UPDATE users SET pet = ? WHERE user_id = ?",
        [petId, userId]
      );

      res.status(200).send({
        success: true, 
        status: 200,
        message: "Pet selected!",
        data: { pet },
      });
    } catch (err) {
      console.log("Choosing Pet Error:", err);
      return res.status(500).send({
        success: false,
        status: 500,
        message: "Unexpected error",
        error: { reason: "Unexpected error" },
      });
    }
  })
});

Router.get("/", async (req, res) => {
  autoSignin(req, res, async (userId) => {
    try {

      const connection = pool.promise();
      const [petInfo] = await connection.query(`SELECT * FROM pets WHERE user_id = ?`, [userId]);

      res.status(200).send({
        success: true,
        status: 200,
        data: petInfo,
      });
    }
    catch (err) {
      console.log("Fetching Pet Info Error:", err);
      return res.status(500).send({
        success: false,
        status: 500,
        message: "Unexpected error",
        error: { reason: "Unexpected error" },
      });
    }
  })
});

module.exports = {
  Router,
};
