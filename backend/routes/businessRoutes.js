const express = require("express");
const router = express.Router();

const businessController = require("../controllers/businessController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

/*
====================================
PUBLIC
====================================
*/

router.get("/", businessController.getAllBusinesses);
router.get("/:slug", businessController.getBusinessBySlug);

/*
====================================
PROVIDER ROUTES
====================================
*/

router.post("/", protect, authorize("provider"), businessController.createBusiness);
router.put("/:id", protect, authorize("provider", "admin"), businessController.updateBusiness);
router.delete("/:id", protect, authorize("provider", "admin"), businessController.deleteBusiness);

/*
====================================
ADMIN ACTIONS
====================================
*/

router.put("/approve/:id", protect, authorize("admin"), businessController.approveBusiness);
router.put("/reject/:id", protect, authorize("admin"), businessController.rejectBusiness);
router.put("/feature/:id", protect, authorize("admin"), businessController.toggleFeatured);

module.exports = router;
