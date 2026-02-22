// ================================
// Dial4Service - server.js
// ================================

const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const Business = require("./models/Business");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(cors({
  origin: "https://dial4service-1.onrender.com",
  credentials: true
}));

//----------------- ROUTES (External Files) ----------------
app.use("/api/admin", require("./routes/adminRoutes" ));
app.use("/api/provider", require("./routes/providerRoutes" ));
app.use("/api/cities", require("./routes/cityRoutes" ));

// ---------------- MONGODB CONNECT ----------------
mongoose
  .connect(process.env.MONGO_URI)
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

// Temperory Admin
app.get("/create-admin", async (req, res) => {
  const hash = await bcrypt.hash("YourStrongPassword123", 10);

  const admin = new User({
    name: "Rahmat Hussain",
    email: "rahmathussain.hjp@gmail.com",
    password: I'mInvisible@4you,
    role: "super-admin"
  });

  await admin.save();
  res.send("Admin Created Successfully");
});

// ---------------- TEST ROUTE ----------------
app.get("/", (req, res) => {
  res.send("✅ Dial4Service Backend Running 🚀");
});

// ---------------- AUTH ROUTES ----------------

// Register (user / provider)
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hash,
      role: role || "user",
    });

    await user.save();
    res.json({ msg: "Registered successfully" });
  } catch (err) {
    res.status(400).json({ msg: "User already exists" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
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

// Add business (Provider / Admin)
app.post("/api/business/add", auth(["provider", "admin"]), async (req, res) => {
  const business = new Business({
    ...req.body,
    ownerId: req.user.id,
    approved: req.user.role === "admin",
  });

  await business.save();
  res.json({ msg: "Business added", business });
});

// Approve business (Admin only)
app.put(
  "/api/business/approve/:id",
  auth(["admin"]),
  async (req, res) => {
    await Business.findByIdAndUpdate(req.params.id, { approved: true });
    res.json({ msg: "Business approved" });
  }
);

// Public business list (Justdial style)
app.get("/api/business/list", async (req, res) => {
  const { city, category } = req.query;

  const filter = { approved: true };
  if (city) filter.city = city;
  if (category) filter.category = category;

  const businesses = await Business.find(filter);
  res.json(businesses);
});

// Provider ke businesses
app.get(
  "/api/business/my",
  auth(["provider", "admin"]),
  async (req, res) => {
    const businesses = await Business.find({ ownerId: req.user.id });
    res.json(businesses);
  }
);

// ---------------- SERVER START ----------------
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
