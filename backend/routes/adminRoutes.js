const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

//Dummy middlewares
const adminAuth = (req, res, next) => next();
const upload = { array: () => (req, res, next) => next() };

// ============== ADMIN ROUTES ==============

// Test Route
router.get("/", (req, res) => {
  res.json({ message: "Admin route working ✅" });
});

// ADMIN LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check email
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      admin: {
        name: admin.name,
        email: admin.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ADD BUSINESS
router.post(
  "/business/add",
  adminAuth,
  upload.array("images", 5),
  [
    body("title").notEmpty().withMessage("Title required"),
    body("category").notEmpty().withMessage("Category required"),
    body("city").notEmpty().withMessage("City required"),
 ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      res.status(201).json({ msg: "Business added (demo)" });
    } catch (err) {
      res.status(500).json({ msg: "Server Error" });
    }
  }
  );

  module.exports = router;


                    
