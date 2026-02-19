const Lead = require("../models/Lead");
const Business = require("../models/Business");

/*
====================================
CREATE LEAD (Public/User)
====================================
*/

exports.createLead = async (req, res) => {
  try {
    const { businessId, name, phone, email, message } = req.body;

    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const lead = await Lead.create({
      business: businessId,
      provider: business.provider,
      user: req.user ? req.user._id : null,
      name,
      phone,
      email,
      message
    });

    res.status(201).json({ success: true, data: lead });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*
====================================
PROVIDER GET OWN LEADS
====================================
*/

exports.getProviderLeads = async (req, res) => {
  try {
    const leads = await Lead.find({
      provider: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

