const { User } = require("../models");

/**
 * Middleware để kiểm tra user có phải admin không
 */
async function admin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await User.findByPk(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { admin };



