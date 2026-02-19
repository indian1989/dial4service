const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

/*
====================================
PUBLIC ROUTES
====================================
*/

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);


/*
====================================
PROTECTED ROUTES
====================================
*/

router.get("/me", protect, authController.getProfile);
router.put("/update-profile", protect, authController.updateProfile);
router.put("/change-password", protect, authController.changePassword);

module.exports = router;
