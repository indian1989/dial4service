const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Provider = require("../models/Provider");
const Admin = require("../models/Admin");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Role ke hisaab se model check karega
      if (decoded.role === "user") {
        req.user = await User.findById(decoded.id).select("-password");
      }

      if (decoded.role === "provider") {
        req.user = await Provider.findById(decoded.id).select("-password");
      }

      if (decoded.role === "admin") {
        req.user = await Admin.findById(decoded.id).select("-password");
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
