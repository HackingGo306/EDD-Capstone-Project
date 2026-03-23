const express = require("express");
const Router = express.Router();
const pool = require("../model/pool");
const { autoSignin } = require('./auth');
const generateRandomId = require("../utils/security").generateRandomId;

Router.post("/choose", async (req, res) => {
  autoSignin(req, res, async (userId) => {
    try {
      let { pet, petName } = req.body;
      if (!petName) petName = "Unnamed";

      if (pet != "cat" && pet != "dog" && pet != "fly" && pet != "human") {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Invalid pet",
          error: { reason: "Invalid pet" },
        });
      }

      const connection = pool.promise();
      const [currentPet] = await connection.query(
        "SELECT pet FROM users WHERE user_id = ?",
        [userId]
      )

      if (currentPet[0].pet == null) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "No egg",
          error: { reason: "No egg to hatch!" },
        });
      }

      const [petInfo] = await connection.query(
        "SELECT pet_id, name, type, xp, level FROM pets WHERE pet_id = ?",
        [currentPet[0].pet]
      );

      if (petInfo[0].type != "egg") {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "No egg to hatch!",
          error: { reason: "No egg to hatch!" },
        });
      }

      if (petInfo[0].level == 0) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Egg too young!",
          error: { reason: "Egg too young!" },
        });
      }

      // Create a new pet in the pet table
      const petId = petInfo[0].pet_id;
      await connection.query(
        "UPDATE pets set name = ?, type = ?, created_at = ? WHERE pet_id = ?",
        [petName, pet, Math.floor(Date.now() / 1000), petId]
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
