require("dotenv").config();
const express = require("express");
const { userModel } = require("../models/user.schema");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { blacklistModel } = require("../models/blacklist.schema");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in with existing user credentials
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       404:
 *         description: User does not exist
 *       401:
 *         description: Incorrect credentials
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Log out the current user and invalidate the token
 *     tags: [Authentication]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Invalid or missing authorization header
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        username:
 *          type: string
 *        email:
 *          type: string
 *        password:
 *          type: string
 *        role:
 *          type: string
 */

const validate = (userData) => {
  const { username, email, password } = userData;
  if (!email || !password || !username) {
    throw new Error("All fields are required.");
  }
};
//
userRouter.post("/signup", async (req, res) => {
  validate(req.body);
  const { username, email, password, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = new userModel({ username, email, password: hash, role });
    await newUser.save();
    res
      .status(201)
      .send({ message: "user registered successfully", user: newUser });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ message: "user does not exist try signing up!" });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(401).send({ message: "Incorrect credentials" });
      }
      if (result) {
        const jwt_token_payload = { userID: user._id, role: user.role };
        const token = jwt.sign(jwt_token_payload, process.env.secretKey, {
          expiresIn: "1hr",
        });
        res
          .status(201)
          .send({ message: "user login successfully", token: token });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error });
  }
});

userRouter.post("/logout", async (req, res) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ message: "Invalid or missing authorization header" });
  }
  const token = authHeader.substring(7);
  try {
    const newBlacklistToken = new blacklistModel({
      token,
      expireAt: new Date(),
    });
    await newBlacklistToken.save();
    res.status(200).send({ message: "Logout successful." });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});
module.exports = {
  userRouter,
};
