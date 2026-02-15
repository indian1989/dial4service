const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// API routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/provider", require("./routes/providerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/category", require("./routes/categoryRoutes"));
app.use("/api/business", require("./routes/businessRoutes"));

/* 🔥 FRONTEND SERVE */
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log("Dial4Service running on port " + PORT)
);
