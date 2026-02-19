const Business = require("../models/Business");

/*
====================================
PROVIDER DASHBOARD STATS
====================================
*/

exports.getProviderDashboard = async (req, res) => {
  try {
    const totalBusinesses = await Business.countDocuments({
      provider: req.user._id
    });

    const approved = await Business.countDocuments({
      provider: req.user._id,
      status: "approved"
    });

    const pending = await Business.countDocuments({
      provider: req.user._id,
      status: "pending"
    });

    res.status(200).json({
      success: true,
      data: {
        totalBusinesses,
        approved,
        pending
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

