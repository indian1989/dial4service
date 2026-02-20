const express = require("express");
const router = express.Router();

const advertisementController = require("../controllers/advertisementController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

/*
====================================
PUBLIC ROUTES
====================================
*/

// Get all active advertisements (for frontend display)
router.get("/active", advertisementController.getActiveAdvertisements);

// Get ads by position (homepage, category, city, etc.)
router.get("/position/:position", advertisementController.getAdsByPosition);


/*
====================================
PROVIDER ROUTES
====================================
*/

// Provider creates advertisement
router.post(
  "/",
  protect,
  authorize("provider"),
  advertisementController.createAdvertisement
);

// Provider view own advertisements
router.get(
  "/my",
  protect,
  authorize("provider"),
  advertisementController.getMyAdvertisements
);

// Provider update own advertisement
router.put(
  "/:id",
  protect,
  authorize("provider"),
  advertisementController.updateAdvertisement
);

// Provider delete own advertisement
router.delete(
  "/:id",
  protect,
  authorize("provider"),
  advertisementController.deleteAdvertisement
);


/*
====================================
ADMIN ROUTES
====================================
*/

// Get all advertisements (admin panel)
router.get(
  "/",
  protect,
  authorize("admin"),
  advertisementController.getAllAdvertisements
);

// Approve advertisement
router.put(
  "/approve/:id",
  protect,
  authorize("admin"),
  advertisementController.approveAdvertisement
);

// Reject advertisement
router.put(
  "/reject/:id",
  protect,
  authorize("admin"),
  advertisementController.rejectAdvertisement
);

// Toggle featured
router.put(
  "/feature/:id",
  protect,
  authorize("admin"),
  advertisementController.toggleFeatured
);

module.exports = router;
