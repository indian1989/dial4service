const Advertisement = require("../models/Advertisement");

/*
====================================
CREATE AD
====================================
*/

exports.createAd = async (req, res) => {
  try {
    const ad = await Advertisement.create(req.body);

    res.status(201).json({
      success: true,
      data: ad
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*
====================================
GET ACTIVE ADS
====================================
*/

exports.getActiveAds = async (req, res) => {
  try {
    const ads = await Advertisement.find({
      isActive: true,
      expiresAt: { $gte: new Date() }
    });

    res.status(200).json({
      success: true,
      data: ads
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

