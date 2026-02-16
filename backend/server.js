// ================================
// Dial4Service - server.js
// ================================

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(cors());

// ---------------- MONGODB CONNECT ----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ---------------- SCHEMAS ----------------

// User / Provider / Admin
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["user", "provider", "admin"],
    default: "user",
  },
});

const User = mongoose.model("User", userSchema);

// Business
const businessSchema = new mongoose.Schema({
  title: String,
  category: String,
  city: String,
  phone: String,
  description: String,
  ownerId: mongoose.Schema.Types.ObjectId,
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Business = mongoose.model("Business", businessSchema);

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

// ---------------- TEST ROUTE ----------------
app.get("/", (req, res) => {
  res.send("✅ Dial4Service Backend Running");
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
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});


const express = require("express");
const app = express();

app.use(express.json());

app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => {
  res.send("Dial4Service Backend Running");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on " + PORT));
