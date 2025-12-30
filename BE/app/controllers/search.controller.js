const { SearchTerm } = require("../models");

class SearchController {
  // GET /search/trends
  async trends(req, res) {
    const list = await SearchTerm.findAll({
      where: { scope: "trend", userId: null },
      order: [["id", "DESC"]],
      limit: 50,
    });
    return res.json({ trends: list.map((x) => x.term) });
  }

  // GET /search/recent
  async recent(req, res) {
    const userId = req.user.id;
    const list = await SearchTerm.findAll({
      where: { scope: "recent", userId },
      order: [["updatedAt", "DESC"]],
      limit: 30,
    });
    return res.json({ recent: list });
  }

  // POST /search/recent { term }
  async addRecent(req, res) {
    const userId = req.user.id;
    const { term } = req.body || {};
    const t = (term || "").trim();
    if (!t) return res.status(400).json({ message: "term required" });

    const existed = await SearchTerm.findOne({ where: { userId, scope: "recent", term: t } });
    if (existed) {
      existed.updatedAt = new Date();
      await existed.save();
      return res.json({ recent: existed });
    }

    const row = await SearchTerm.create({ userId, scope: "recent", term: t });
    return res.status(201).json({ recent: row });
  }

  // DELETE /search/recent/:id
  async removeRecent(req, res) {
    const userId = req.user.id;
    const id = req.params.id;

    const row = await SearchTerm.findOne({ where: { id, userId, scope: "recent" } });
    if (!row) return res.status(404).json({ message: "Not found" });

    await row.destroy();
    return res.json({ message: "Deleted" });
  }

  // POST /search/recent/clear
  async clearRecent(req, res) {
    const userId = req.user.id;
    await SearchTerm.destroy({ where: { userId, scope: "recent" } });
    return res.json({ message: "Cleared" });
  }
}

module.exports = new SearchController();
