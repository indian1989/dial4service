const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.post("/create-order", protect, authorize("provider"), paymentController.createOrder);
router.post("/verify", protect, authorize("provider"), paymentController.verifyPayment);

router.get("/", protect, authorize("admin"), paymentController.getAllPayments);

module.exports = router;
