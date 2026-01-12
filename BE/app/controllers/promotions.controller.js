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

  // GET /api/flash-sales
  async flashSales(req, res) {
    const list = await Promotion.findAll({
      where: { type: "flash_sale" },
      order: [["endsAt", "ASC"], ["id", "DESC"]],
    });

    const items = list.map((p) => ({
      id: p.id,
      title: p.title,
      discountText: p.discountValue
        ? p.discountType === "percent"
          ? `Giảm ${Math.round(Number(p.discountValue))}%`
          : `Giảm ${Math.round(Number(p.discountValue)).toLocaleString("vi-VN")}đ`
        : null,
      startAt: p.startsAt,
      endAt: p.endsAt,
      isActive: p.isActive ? 1 : 0,
    }));

    return res.json(items);
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
