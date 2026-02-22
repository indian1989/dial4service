const express = require("express");
const router = express.Router();

const cityController = require("../controllers/cityController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

/*
====================================
PUBLIC
====================================
*/

router.get("/", cityController.getAllCities);
router.get("/:slug", cityController.getCityBySlug);

/*
====================================
ADMIN ONLY
====================================
*/

router.post("/", protect, authorize("admin", "super-admin"), cityController.createCity);
router.put("/:id", protect, authorize("admin", "super-admin"), cityController.updateCity);
router.delete("/:id", protect, authorize("admin", "super-admin"), cityController.deleteCity);

module.exports = router;
