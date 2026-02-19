const express = require("express");
const router = express.Router();

const {
  createCity,
  getAllCities,
  getCityBySlug,
  updateCity,
  deleteCity
} = require("../controllers/cityController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

/*
====================================
PUBLIC ROUTES
====================================
*/

// Get all cities
router.get("/", getAllCities);

// Get single city by slug
router.get("/:slug", getCityBySlug);


/*
====================================
ADMIN ROUTES
====================================
*/

// Create city
router.post("/", protect, authorize("admin"), createCity);

// Update city
router.put("/:id", protect, authorize("admin"), updateCity);

// Delete city
router.delete("/:id", protect, authorize("admin"), deleteCity);


module.exports = router;
