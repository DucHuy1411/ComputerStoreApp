const { Promotion, PromotionItem, Product } = require("../models");
const { Op } = require("sequelize");

class PromotionsController {
  // GET /promotions?type=voucher|flash_sale
  async index(req, res) {
    const { type } = req.query;
    const where = { isActive: true };
    if (type) where.type = type;

    const list = await Promotion.findAll({
      where,
      order: [["id", "DESC"]],
    });

    return res.json({ promotions: list });
  }

  // GET /promotions/:id/items (flash sale products)
  async items(req, res) {
    const id = req.params.id;
    const promo = await Promotion.findByPk(id);
    if (!promo) return res.status(404).json({ message: "Promotion not found" });

    const items = await PromotionItem.findAll({
      where: { promotionId: promo.id },
      include: [{ model: Product, as: "product" }],
      order: [["id", "DESC"]],
    });

    return res.json({ promotion: promo, items });
  }
}

module.exports = new PromotionsController();
