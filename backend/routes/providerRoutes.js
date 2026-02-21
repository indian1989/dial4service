const express = require("express");
const router = express.Router();

const providerController = require("../controllers/providerController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

/*
====================================
ALL ROUTES PROTECTED (PROVIDER ONLY)
====================================
*/

router.use(protect);
router.use(authorize("provider"));


/*
====================================
DASHBOARD
====================================
*/

// Provider dashboard statistics
router.get("/dashboard-stats", providerController.getDashboardStats);


/*
====================================
BUSINESS MANAGEMENT
====================================
*/

// Get all businesses of provider
router.get("/businesses", providerController.getMyBusinesses);

// Get single business details
router.get("/business/:id", providerController.getSingleBusiness);

// Create new business
router.post("/business", providerController.createBusiness);

// Update business
router.put("/business/:id", providerController.updateBusiness);

// Delete business
router.delete("/business/:id", providerController.deleteBusiness);


/*
====================================
GALLERY MANAGEMENT
====================================
*/

// Upload gallery images
router.post("/business/:id/gallery", providerController.uploadGallery);

// Delete gallery image
router.delete("/business/:id/gallery/:imageId", providerController.deleteGalleryImage);


/*
====================================
LEADS MANAGEMENT
====================================
*/

// Get leads for provider
router.get("/leads", providerController.getMyLeads);

// Mark lead as contacted
router.put("/lead/:id/contacted", providerController.markLeadContacted);


/*
====================================
ADVERTISEMENT MANAGEMENT
====================================
*/

// Get provider advertisements
router.get("/advertisements", providerController.getMyAdvertisements);

// Create advertisement
router.post("/advertisement", providerController.createAdvertisement);

// Update advertisement
router.put("/advertisement/:id", providerController.updateAdvertisement);

// Delete advertisement
router.delete("/advertisement/:id", providerController.deleteAdvertisement);


/*
====================================
SUBSCRIPTION & PAYMENTS
====================================
*/

// Get current subscription
router.get("/subscription", providerController.getSubscription);

// Upgrade plan
router.post("/upgrade-plan", providerController.upgradePlan);

// Payment history
router.get("/payments", providerController.getPaymentHistory);


/*
====================================
PROFILE MANAGEMENT
====================================
*/

// Get provider profile
router.get("/profile", providerController.getProfile);

// Update profile
router.put("/profile", providerController.updateProfile);

// Change password
router.put("/change-password", providerController.changePassword);

router.get("/", (req, res) => {
  res.json({ message: "Provider route working ✅" });
});
module.exports = router;
