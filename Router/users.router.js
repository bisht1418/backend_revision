const express = require("express");
const { userModel } = require("../Model/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();
require("dotenv").config();

userRouter.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 5);
    const newUser = new userModel({
      email,
      password: hashPassword,
      username,
    });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", data: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

userRouter.get("/", async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { userRouter };
