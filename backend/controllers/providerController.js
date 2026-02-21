const Business = require("../models/Business");

/*
====================================
PROVIDER DASHBOARD STATS
====================================
*/

exports.getDashboardStats = async (req, res) => {
  try {
    const totalBusinesses = await Business.countDocuments({
      provider: req.user._id,
    });

    const approved = await Business.countDocuments({
      provider: req.user._id,
      status: "approved",
    });

    const pending = await Business.countDocuments({
      provider: req.user._id,
      status: "pending",
    });

    res.status(200).json({
      success: true,
      data: {
        totalBusinesses,
        approved,
        pending,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
PLACEHOLDER FUNCTIONS
================================ */

exports.getMyBusinesses = (req, res) => res.json({ message: "getMyBusinesses working" });
exports.getSingleBusiness = (req, res) => res.json({ message: "getSingleBusiness working" });
exports.createBusiness = (req, res) => res.json({ message: "createBusiness working" });
exports.updateBusiness = (req, res) => res.json({ message: "updateBusiness working" });
exports.deleteBusiness = (req, res) => res.json({ message: "deleteBusiness working" });

exports.uploadGallery = (req, res) => res.json({ message: "uploadGallery working" });
exports.deleteGalleryImage = (req, res) => res.json({ message: "deleteGalleryImage working" });

exports.getMyLeads = (req, res) => res.json({ message: "getMyLeads working" });
exports.markLeadContacted = (req, res) => res.json({ message: "markLeadContacted working" });

exports.getMyAdvertisements = (req, res) => res.json({ message: "getMyAdvertisements working" });
exports.createAdvertisement = (req, res) => res.json({ message: "createAdvertisement working" });
exports.updateAdvertisement = (req, res) => res.json({ message: "updateAdvertisement working" });
exports.deleteAdvertisement = (req, res) => res.json({ message: "deleteAdvertisement working" });

exports.getSubscription = (req, res) => res.json({ message: "getSubscription working" });
exports.upgradePlan = (req, res) => res.json({ message: "upgradePlan working" });
exports.getPaymentHistory = (req, res) => res.json({ message: "getPaymentHistory working" });

exports.getProfile = (req, res) => res.json({ message: "getProfile working" });
exports.updateProfile = (req, res) => res.json({ message: "updateProfile working" });
exports.changePassword = (req, res) => res.json({ message: "changePassword working" });
