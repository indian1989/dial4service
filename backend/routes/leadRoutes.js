const express = require("express");
const router = express.Router();

const leadController = require("../controllers/leadController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

/*
====================================
PUBLIC (Lead Submit)
====================================
*/

router.post("/", leadController.createLead);

/*
====================================
PROVIDER
====================================
*/

router.get("/my", protect, authorize("provider"), leadController.getProviderLeads);

/*
====================================
ADMIN
====================================
*/

router.get("/", protect, authorize("admin"), leadController.getAllLeads);
router.delete("/:id", protect, authorize("admin"), leadController.deleteLead);

module.exports = router;
