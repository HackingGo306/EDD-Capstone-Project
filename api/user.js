const express = require("express");
const Router = express.Router();
const pool = require("../model/pool");
const { autoSignin } = require('./auth');

Router.get("/", async (req, res) => {
  autoSignin(req, res, async (userId) => {
    try {

      const connection = pool.promise();
      const [[userInfo]] = await connection.query(`SELECT user_id, name, email FROM users WHERE user_id = ?`, [userId]);

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

module.exports = {
  Router,
};