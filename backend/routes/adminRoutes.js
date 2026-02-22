const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// TEST ROUTE
router.get("/", (req, res) => {
  res.json({ message: "Admin route working" });
});

// ADMIN LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({
      email,
      role: { $in: ["admin", "super-admin"] }
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = admin.generateToken();

    res.json({
      token,
      admin: {
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// CREATE ADMIN (Only Super Admin)
router.post(
  "/create-admin",
  protect,
  authorize("super-admin"),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hash = await bcrypt.hash(password, 10);

      const newAdmin = new User({
        name,
        email,
        password: hash,
        role: "admin"
      });

      await newAdmin.save();

      res.status(201).json({
        message: "Admin Created Successfully"
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
