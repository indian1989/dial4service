const jwt = require("jsonwebtoken");

const providerAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ msg: "No token provided" });
    }

    // Expected format: Bearer TOKEN
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check role
    if (decoded.role !== "provider") {
      return res.status(403).json({ msg: "Provider access required" });
    }

    // Attach provider data to request
    req.provider = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token invalid or expired" });
  }
};

module.exports = providerAuth;
