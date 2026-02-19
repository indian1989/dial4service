const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

/*
====================================
PUBLIC
====================================
*/

router.get("/", categoryController.getAllCategories);
router.get("/:slug", categoryController.getCategoryBySlug);

/*
====================================
ADMIN ONLY
====================================
*/

router.post("/", protect, authorize("admin"), categoryController.createCategory);
router.put("/:id", protect, authorize("admin"), categoryController.updateCategory);
router.delete("/:id", protect, authorize("admin"), categoryController.deleteCategory);

module.exports = router;
