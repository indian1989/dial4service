const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

/*
====================================
PUBLIC
====================================
*/

router.get("/business/:businessId", reviewController.getBusinessReviews);

/*
====================================
USER
====================================
*/

router.post("/", protect, authorize("user"), reviewController.createReview);
router.put("/:id", protect, authorize("user"), reviewController.updateReview);
router.delete("/:id", protect, authorize("user", "admin"), reviewController.deleteReview);

module.exports = router;
