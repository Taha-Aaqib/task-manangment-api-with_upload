const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ error: "User already exists" });
    const user = await User.create({ name, email, password });
    res.json({ message: "User registered successfully", userId: user._id });
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ error: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "supersecretkey123",
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" },
    );
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
