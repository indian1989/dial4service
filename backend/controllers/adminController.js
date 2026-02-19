const Business = require("../models/Business");
const User = require("../models/User");
const Provider = require("../models/Provider");

/*
====================================
ADMIN DASHBOARD STATS
====================================
*/

exports.getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProviders = await Provider.countDocuments();
    const totalBusinesses = await Business.countDocuments();
    const pendingBusinesses = await Business.countDocuments({
      status: "pending"
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProviders,
        totalBusinesses,
        pendingBusinesses
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

