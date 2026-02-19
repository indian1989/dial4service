const User = require("../models/User");
const Provider = require("../models/Provider");
const Admin = require("../models/Admin");

/*
====================================
REGISTER (User / Provider)
====================================
*/

exports.register = async (req, res) => {
  try {
    const { role, name, email, phone, password, businessName } = req.body;

    let account;

    if (role === "user") {
      account = await User.create({
        name,
        email,
        phone,
        password
      });
    }

    else if (role === "provider") {
      account = await Provider.create({
        name,
        businessName,
        email,
        phone,
        password
      });
    }

    else {
      return res.status(400).json({
        message: "Invalid role selected"
      });
    }

    res.status(201).json({
      success: true,
      token: account.generateToken(),
      data: account
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/*
====================================
LOGIN (Auto Detect Role)
====================================
*/

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let account = await User.findOne({ email });

    if (!account) {
      account = await Provider.findOne({ email });
    }

    if (!account) {
      account = await Admin.findOne({ email });
    }

    if (!account) {
      return res.status(401).json({
        message: "Invalid Email or Password"
      });
    }

    const isMatch = await account.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Email or Password"
      });
    }

    res.status(200).json({
      success: true,
      token: account.generateToken(),
      role: account.role,
      data: account
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/*
====================================
GET LOGGED IN USER PROFILE
====================================
*/

exports.getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
};
