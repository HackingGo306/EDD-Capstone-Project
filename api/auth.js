const express = require("express");
const Router = express.Router();
const { DateTime } = require("luxon");
const { generateRandomId, hashing } = require("../utils/security");
const crypto = require("node:crypto");
const pool = require("../model/pool");
const { USER_ID_COOKIE_OPTIONS } = require("../utils/constants");

async function autoSignin(
  req,
  res,
  success = () => { },
  fail = () => {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid User",
      error: { reason: "No valid session or token found" },
    });
  }
) {
  try {
    if (process.env.NODE_ENV === "development") {
      // req.session.user_id = process.env.TESTER_ID;
      // return success(process.env.TESTER_ID);
    }

    if (req.session.user_id) {
      return success(req.session.user_id);
    }

    if (req.signedCookies.userId) {
      req.session.user_id = req.signedCookies.userId;
      return success(req.signedCookies.userId);
    }

    const authHeader = req.headers.authorization;
    const userId = req.headers["user-id"];
    const deviceId = req.headers["device-id"];

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ") ||
      !userId ||
      !deviceId
    ) {
      return fail();
    }

    const token = authHeader.split(" ")[1];
    if (!token) return fail();

    const savedToken = await getDeviceToken(userId, deviceId);
    if (savedToken !== token) return fail(); // Token mismatch

    success(userId);
  } catch (err) {
    console.log(err);
    return fail();
  }
}

async function createAccount({ name, email, userInfo }) {
  try {
    const created_at = DateTime.now().set({ millisecond: 0 }).toSeconds();

    // TODO: Sanitize inputs (check if email is in proper format, check if name doesn't contain special characters, etc.)

    const user_id = generateRandomId(10);
    const connection = pool.promise();

    const [[checkEmail]] = await connection.query(
      "SELECT email FROM users WHERE email = ?",
      email
    );

    if (checkEmail) {
      return {
        success: false,
        status: 400,
        message: "Email already in use",
        error: { reason: "Email already in use" },
      };
    }

    const user = {
      name,
      email,
      user_id,
      created_at,
      ...userInfo,
    };

    await connection.query("INSERT INTO users SET ?", user);

    return {
      success: true,
      status: 200,
      message: "Account Created!",
      data: { user_id },
    };
  } catch (err) {
    console.log(err);
  }
}

Router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const connection = pool.promise();

    const [[userInfo]] = await connection.query(
      "SELECT user_id, salt, hashed_password, email, name, hashed_password FROM users WHERE email = ?",
      email
    );

    if (!userInfo) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "User does not exist",
        error: { reason: "User does not exist" },
      });
    }

    const hashedPassword = crypto
      .pbkdf2Sync(password, userInfo.salt, 99097, 32, "sha512")
      .toString("hex");

    if (hashedPassword !== userInfo.hashed_password) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Wrong password",
        error: { reason: "Wrong password" },
      });
    }

    // Generate a new session ID
    req.session.regenerate((err) => {
      if (err) {
        console.log("Error regenerating session ID:", err);
        return res.status(500).send({
          success: false,
          status: 500,
          message: "Unexpected error",
          error: { reason: "Unexpected error" },
        });
      }

      req.session.user_id = userInfo.user_id;

      res.cookie("userId", userInfo.user_id, USER_ID_COOKIE_OPTIONS);

      res.status(200).send({ success: true, status: 200, message: "Success!" });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      status: 500,
      message: "Unexpected error",
      error: { reason: "Unexpected error" },
    });
  }
});

Router.post("/signup", async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // TODO: validate password strength

    const [salt, hashed_password] = hashing(password);

    const response = await createAccount({
      name,
      email,
      userInfo: {
        salt,
        hashed_password,
      },
    });

    const { success, data } = response;

    if (!success) {
      return res.status(400).send(response);
    }

    const { user_id } = data;

    req.session.regenerate((err) => {
      if (err) {
        console.log("Error regenerating session ID:", err);
        return res.status(500).send({
          success: false,
          status: 500,
          message: "Unexpected error",
          error: { reason: "Unexpected error" },
        });
      }
      req.session.user_id = user_id;
    });

    res.cookie("userId", user_id, USER_ID_COOKIE_OPTIONS);

    res.status(200).send({
      success: true,
      status: 200,
      message: "Account Created!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      status: 500,
      message: "Unexpected error",
      error: { reason: "Unexpected error" },
    });
  }
});

Router.get("/logout", function (req, res) {
  try {
    if (!req.session) {
      return res.status(200).send({ success: true, status: 200, message: "No session to destroy" });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send({ success: false, status: 500 });
      }

      res.clearCookie("userId", USER_ID_COOKIE_OPTIONS);

      res.status(200).send({ success: true, status: 200, message: "Logged out successfully" });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      status: 500,
      message: "Unexpected error",
      error: { reason: "Unexpected error" },
    });
  }
});

module.exports = {
  autoSignin,
  Router,
};
