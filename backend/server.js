// ================================
// Dial4Service - Scalable Server
// ================================

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const User = require("./models/User");
const Business = require("./models/Business");

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(express.json({ limit: "10mb" }));
app.use(cors());

// Rate Limiting (Protection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
});
app.use(limiter);

// ---------------- DATABASE ----------------
mongoose
  .connect(process.env.MONGO_URI, {
    autoIndex: false, // Important for large DB
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ---------------- AUTH MIDDLEWARE ----------------
const auth = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ msg: "No token" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ msg: "Access denied" });
      }

      next();
    } catch (err) {
      res.status(401).json({ msg: "Invalid token" });
    }
  };
};

// ---------------- AUTH ROUTES ----------------

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hash,
      role: ROLES.USER // FORCE USER ROLE
    });

    await user.save();

    res.json({ message: "Registered successfully" });

  } catch (err) {
    res.status(400).json({ message: "Registration failed" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).lean();
  if (!user) return res.status(404).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, role: user.role });
});

// ---------------- BUSINESS ROUTES ----------------

// Add Business
app.post("/api/business/add", auth(["provider", "admin"]), async (req, res) => {
  const business = new Business({
    ...req.body,
    ownerId: req.user.id,
    approved: req.user.role === "admin",
  });

  await business.save();
  res.json({ msg: "Business added", business });
});

// Approve
app.put("/api/business/approve/:id",
  auth(["admin"]),
  async (req, res) => {
    await Business.findByIdAndUpdate(req.params.id, { approved: true });
    res.json({ msg: "Business approved" });
  }
);

// 🚀 SCALABLE LIST (Pagination + Limit Cap)
app.get("/api/business/list", async (req, res) => {
  try {
    const {
      city,
      category,
      page = 1,
      limit = 20
    } = req.query;

    const safeLimit = Math.min(parseInt(limit), 50); // Max 50 per request
    const skip = (page - 1) * safeLimit;

    const filter = { approved: true };
    if (city) filter.city = city;
    if (category) filter.category = category;

    const businesses = await Business.find(filter)
      .skip(skip)
      .limit(safeLimit)
      .lean();

    const total = await Business.countDocuments(filter);

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / safeLimit),
      data: businesses,
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Provider Businesses
app.get("/api/business/my",
  auth(["provider", "admin"]),
  async (req, res) => {
    const businesses = await Business.find({ ownerId: req.user.id }).lean();
    res.json(businesses);
  }
);

// ---------------- TEST ----------------
app.get("/", (req, res) => {
  res.send("✅ Dial4Service Backend Running 🚀");
});

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
