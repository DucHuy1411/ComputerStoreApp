const { Product, Category, Promotion, PromotionItem } = require("../models");
const { Op } = require("sequelize");

class ProductsController {
  // GET /products (filters: q, categoryId, minPrice, maxPrice, freeship, installment0, sort)
  async index(req, res) {
    const {
      q,
      categoryId,
      minPrice,
      maxPrice,
      freeship,
      installment0,
      sort = "popular", // popular|newest|price_asc|price_desc|rating
      limit = 50,
      offset = 0,
    } = req.query;

    const where = { status: "active" };

    if (q) where.name = { [Op.like]: `%${q}%` };
    if (categoryId) where.categoryId = Number(categoryId);
    if (minPrice) where.price = { ...(where.price || {}), [Op.gte]: Number(minPrice) };
    if (maxPrice) where.price = { ...(where.price || {}), [Op.lte]: Number(maxPrice) };
    if (freeship === "1") where.isFreeship = true;
    if (installment0 === "1") where.isInstallment0 = true;

    const order = (() => {
      if (sort === "newest") return [["createdAt", "DESC"]];
      if (sort === "price_asc") return [["price", "ASC"]];
      if (sort === "price_desc") return [["price", "DESC"]];
      if (sort === "rating") return [["ratingAvg", "DESC"], ["reviewsCount", "DESC"]];
      // popular
      return [["reviewsCount", "DESC"]];
    })();

    const rows = await Product.findAll({
      where,
      include: [{ model: Category, as: "category", attributes: ["id", "name", "slug"] }],
      order,
      limit: Math.min(Number(limit), 100),
      offset: Number(offset),
    });

    return res.json({ products: rows });
  }

  // GET /products/:id
  async detail(req, res) {
    const id = req.params.id;
    const p = await Product.findByPk(id, { include: [{ model: Category, as: "category" }] });
    if (!p) return res.status(404).json({ message: "Product not found" });
    return res.json({ product: p });
  }

  // GET /products/:id/flash-sale (nếu có flash sale)
  async flashSaleInfo(req, res) {
    const productId = Number(req.params.id);

    const promo = await Promotion.findOne({
      where: { type: "flash_sale", isActive: true },
      include: [{
        model: PromotionItem,
        as: "items",
        where: { productId },
        required: true,
      }],
    });

    if (!promo) return res.json({ flashSale: null });
    return res.json({ flashSale: promo });
  }
}

module.exports = new ProductsController();
