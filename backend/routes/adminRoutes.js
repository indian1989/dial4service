const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { ROLES } = require("../config/constants");

// TEST
router.get("/", (req, res) => {
  res.json({ message: "Admin route working" });
});

// ✅ ADMIN + SUPER ADMIN LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({
      email,
      role: { $in: [ROLES.ADMIN, ROLES.SUPER_ADMIN] }
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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
