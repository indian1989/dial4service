const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

/*
====================================
PROTECTED ROUTES (USER SELF)
====================================
*/

// Get logged-in user profile
router.get("/profile", protect, authorize("user"), userController.getProfile);

// Update profile
router.put("/profile", protect, authorize("user"), userController.updateProfile);

// Change password
router.put("/change-password", protect, authorize("user"), userController.changePassword);

// Deactivate account
router.put("/deactivate", protect, authorize("user"), userController.deactivateAccount);


/*
====================================
USER FEATURES
====================================
*/

// Get user reviews
router.get("/my-reviews", protect, authorize("user"), userController.getMyReviews);

// Get user leads
router.get("/my-leads", protect, authorize("user"), userController.getMyLeads);

// Save business to favorites
router.post(
  "/favorites/:businessId",
  protect,
  authorize("user"),
  userController.addToFavorites
);

// Remove from favorites
router.delete(
  "/favorites/:businessId",
  protect,
  authorize("user"),
  userController.removeFromFavorites
);

// Get favorite businesses
router.get(
  "/favorites",
  protect,
  authorize("user"),
  userController.getFavorites
);


/*
====================================
ADMIN CONTROL ON USERS
====================================
*/

// Get all users
router.get(
  "/",
  protect,
  authorize("admin"),
  userController.getAllUsers
);

// Block user
router.put(
  "/block/:id",
  protect,
  authorize("admin"),
  userController.blockUser
);

// Unblock user
router.put(
  "/unblock/:id",
  protect,
  authorize("admin"),
  userController.unblockUser
);

// Delete user
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  userController.deleteUser
);

module.exports = router;
