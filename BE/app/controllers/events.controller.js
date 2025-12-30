const { UserProductEvent, Product } = require("../models");

class EventsController {
  // GET /events/favorites
  async favorites(req, res) {
    const userId = req.user.id;
    const list = await UserProductEvent.findAll({
      where: { userId, type: "favorite" },
      include: [{ model: Product, as: "product" }],
      order: [["updatedAt", "DESC"]],
    });
    return res.json({ favorites: list });
  }

  // POST /events/favorites/toggle { productId }
  async toggleFavorite(req, res) {
    const userId = req.user.id;
    const { productId } = req.body || {};
    if (!productId) return res.status(400).json({ message: "productId required" });

    const existed = await UserProductEvent.findOne({ where: { userId, productId, type: "favorite" } });
    if (existed) {
      await existed.destroy();
      return res.json({ favorite: false });
    }

    await UserProductEvent.create({ userId, productId, type: "favorite" });
    return res.json({ favorite: true });
  }

  // GET /events/recent
  async recent(req, res) {
    const userId = req.user.id;
    const list = await UserProductEvent.findAll({
      where: { userId, type: "recent" },
      include: [{ model: Product, as: "product" }],
      order: [["lastSeenAt", "DESC"]],
      limit: 50,
    });
    return res.json({ recent: list });
  }

  // POST /events/recent/seen { productId }
  async markSeen(req, res) {
    const userId = req.user.id;
    const { productId } = req.body || {};
    if (!productId) return res.status(400).json({ message: "productId required" });

    const now = new Date();
    const existed = await UserProductEvent.findOne({ where: { userId, productId, type: "recent" } });
    if (existed) {
      existed.lastSeenAt = now;
      await existed.save();
      return res.json({ ok: true });
    }

    await UserProductEvent.create({ userId, productId, type: "recent", lastSeenAt: now });
    return res.json({ ok: true });
  }
}

module.exports = new EventsController();
