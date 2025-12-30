const { User, Order, Notification } = require("../models");
const { Op } = require("sequelize");

class UsersController {
  // GET /me
  async me(req, res) {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "fullName", "email", "phone", "status", "role", "avatarUrl", "createdAt", "updatedAt"],
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  }

  // PUT /me
  async updateMe(req, res) {
    const { fullName, phone, email, password, currentPassword } = req.body || {};

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ===== profile fields =====
    if (fullName !== undefined) user.fullName = String(fullName || "").trim();
    if (phone !== undefined) user.phone = phone ? String(phone).trim() : null;

    // ===== email change (unique + normalize) =====
    if (email !== undefined) {
      const nextEmail = String(email || "").trim().toLowerCase();
      if (!nextEmail) return res.status(400).json({ message: "Email is required" });

      if (nextEmail !== String(user.email || "").toLowerCase()) {
        const exists = await User.findOne({ where: { email: nextEmail } });
        if (exists) return res.status(409).json({ message: "Email already in use" });
        user.email = nextEmail;
      }
    }

    // ===== password change (requires currentPassword) =====
    if (password !== undefined) {
      const nextPw = String(password || "");
      const curPw = String(currentPassword || "");
      if (nextPw.length < 6) return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

      if (!curPw) return res.status(400).json({ message: "currentPassword is required" });

      const bcrypt = require("bcryptjs");
      const ok = await bcrypt.compare(curPw, String(user.passwordHash || ""));
      if (!ok) return res.status(401).json({ message: "Current password is incorrect" });

      user.passwordHash = await bcrypt.hash(nextPw, 10);
    }

    await user.save();

    // tránh lộ passwordHash
    const safeUser = user.toJSON ? user.toJSON() : user;
    if (safeUser && "passwordHash" in safeUser) delete safeUser.passwordHash;

    return res.json({ message: "Updated", user: safeUser });
  }

  // GET /me/stats (AccountScreen order status counters + notifications count)
  async stats(req, res) {
    const userId = req.user.id;

    const [pending, shipping, done] = await Promise.all([
      Order.count({ where: { userId, status: "pending" } }),
      Order.count({ where: { userId, status: "shipping" } }),
      Order.count({ where: { userId, status: "done" } }),
    ]);

    const unreadNoti = await Notification.count({ where: { userId, isRead: false } });

    return res.json({
      orders: { pending, shipping, done },
      notificationsUnread: unreadNoti,
    });
  }

  // GET /users (admin/dev)
  async index(req, res) {
    const users = await User.findAll({
      attributes: ["id", "fullName", "email", "phone", "status", "role", "createdAt"],
      limit: 200,
      order: [["id", "DESC"]],
    });
    return res.json({ users });
  }
}

module.exports = new UsersController();
