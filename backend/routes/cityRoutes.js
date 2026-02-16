const express = require("express");
const router = express.Router();
const City = require("../models/City");
const adminAuth = require("../middleware/adminAuth");

// ADD CITY (ADMIN)
router.post("/add", adminAuth, async (req, res) => {
  try {
    const { name, state, popular } = req.body;

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const city = new City({
      name,
      state,
      slug,
      popular
    });

    await city.save();
    res.json({ msg: "City added", city });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET ALL ACTIVE CITIES (PUBLIC)
router.get("/", async (req, res) => {
  const cities = await City.find({ active: true }).sort({ name: 1 });
  res.json(cities);
});

module.exports = router;
