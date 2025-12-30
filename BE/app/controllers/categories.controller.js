const { Category } = require("../models");

class CategoriesController {
  // GET /categories?tree=1
  async index(req, res) {
    const tree = req.query.tree === "1";

    if (!tree) {
      const list = await Category.findAll({
        where: { isActive: true },
        order: [["sortOrder", "ASC"], ["id", "ASC"]],
      });
      return res.json({ categories: list });
    }

    const parents = await Category.findAll({
      where: { parentId: null, isActive: true },
      order: [["sortOrder", "ASC"], ["id", "ASC"]],
      include: [{ model: Category, as: "children", where: { isActive: true }, required: false, order: [["sortOrder", "ASC"]] }],
    });

    return res.json({ categories: parents });
  }
}

module.exports = new CategoriesController();
