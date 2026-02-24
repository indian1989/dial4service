const express = require("express");
const router = express.Router();

const businessController = require("../controllers/businessController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

/*
====================================
PUBLIC ROUTES
====================================
*/

// Paginated + Filtered List
// Example:
// /api/business?city=patna&category=electrician&page=1&limit=20
router.get("/", businessController.getAllBusinesses);

// Geo Near Me
// /api/business/near?lat=25.6&lng=85.1&distance=5000
router.get("/near", businessController.getNearbyBusinesses);

// Text Search
// /api/business/search?q=electrician patna
router.get("/search", businessController.searchBusinesses);

// SEO Friendly Route
// /api/business/patna/electrician
router.get("/:citySlug/:categorySlug",
  businessController.getByCityCategory
);


/*
====================================
PROVIDER ROUTES
====================================
*/

router.post("/",
  protect,
  authorize("provider"),
  businessController.createBusiness
);

router.put("/:id",
  protect,
  authorize("provider", "admin"),
  businessController.updateBusiness
);

router.delete("/:id",
  protect,
  authorize("provider", "admin"),
  businessController.deleteBusiness
);


/*
====================================
ADMIN ROUTES
====================================
*/

router.put("/approve/:id",
  protect,
  authorize("admin"),
  businessController.approveBusiness
);

router.put("/reject/:id",
  protect,
  authorize("admin"),
  businessController.rejectBusiness
);

router.put("/feature/:id",
  protect,
  authorize("admin"),
  businessController.toggleFeatured
);


/*
====================================
SINGLE BUSINESS (MUST BE LAST)
====================================
*/

// /api/business/electrician-patna-0001
router.get("/slug/:slug",
  businessController.getBusinessBySlug
);

module.exports = router;
