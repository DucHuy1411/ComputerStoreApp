const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { JWT_SECRET } = require("../middlewares/auth.middleware");

class AuthController {
  // POST /auth/register
  async register(req, res) {
    const { email, phone, password, fullName } = req.body || {};
    if (!password || password.length < 6) return res.status(400).json({ message: "Password must be >= 6 chars" });
    if (!email && !phone) return res.status(400).json({ message: "Email or phone is required" });

    const existed = await User.findOne({
      where: email ? { email } : { phone },
    });
    if (existed) return res.status(409).json({ message: "Account already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName: fullName || null,
      email: email || null,
      phone: phone || null,
      passwordHash,
      status: "active",
      role: "customer",
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "30d" });
    return res.json({
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, role: user.role },
    });
  }

  // POST /auth/login (identifier = email/phone)
  async login(req, res) {
    const { identifier, email, phone, password } = req.body || {};
    const idf = identifier || email || phone;
    if (!idf || !password) return res.status(400).json({ message: "Identifier and password are required" });

    const user = await User.findOne({
      where: idf.includes("@") ? { email: idf } : { phone: idf },
    });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    if (user.status !== "active") return res.status(403).json({ message: "Account is not active" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "30d" });
    return res.json({
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, role: user.role },
    });
  }
}

module.exports = new AuthController();
