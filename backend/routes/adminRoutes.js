const express = require("express");
const router = express.Router();

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
  const { email, password } = req.body;

  try {
    // Replace with real Admin model
    if (email !== "admin@test.com" || password !== "123456") {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: "adminid", role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
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


                    
