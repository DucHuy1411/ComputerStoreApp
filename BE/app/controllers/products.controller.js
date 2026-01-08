const { Product, Category, Promotion, PromotionItem, OrderItem } = require("../models");
const { Op } = require("sequelize");

class ProductsController {
  // GET /products (filters: q, categoryId, minPrice, maxPrice, freeship, installment0, sort, status)
  async index(req, res) {
    const {
      q,
      categoryId,
      minPrice,
      maxPrice,
      freeship,
      installment0,
      status, // Thêm filter status cho admin
      sort = "popular", // popular|newest|price_asc|price_desc|rating
      limit = 50,
      offset = 0,
    } = req.query;

    const where = {};
    
    // Nếu không có status filter, chỉ lấy active (cho customer)
    // Nếu có status filter, lấy theo filter (cho admin)
    if (status) {
      where.status = status;
    } else {
      where.status = "active";
    }

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

  // POST /products
  async create(req, res) {
    try {
      const {
        categoryId,
        name,
        slug,
        sku,
        brandName,
        price,
        oldPrice,
        discountPct,
        installmentMonthly,
        stock,
        isFreeship,
        isInstallment0,
        images,
        specs,
        tags,
        description,
        status = "active",
      } = req.body;

      // Validation
      if (!categoryId || !name || !slug || !sku || price === undefined) {
        return res.status(400).json({ message: "categoryId, name, slug, sku, price are required" });
      }

      // Check unique slug và sku
      const existingSlug = await Product.findOne({ where: { slug } });
      if (existingSlug) {
        return res.status(409).json({ message: "Slug already exists" });
      }

      const existingSku = await Product.findOne({ where: { sku } });
      if (existingSku) {
        return res.status(409).json({ message: "SKU already exists" });
      }

      // Check category exists
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Tính discountPct nếu có oldPrice
      let calculatedDiscountPct = discountPct;
      if (oldPrice && oldPrice > price) {
        calculatedDiscountPct = Math.round(((oldPrice - price) / oldPrice) * 100);
      }

      const product = await Product.create({
        categoryId,
        name: String(name).trim(),
        slug: String(slug).trim(),
        sku: String(sku).trim(),
        brandName: brandName ? String(brandName).trim() : null,
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : null,
        discountPct: calculatedDiscountPct,
        installmentMonthly: installmentMonthly ? Number(installmentMonthly) : null,
        stock: Number(stock) || 0,
        isFreeship: Boolean(isFreeship),
        isInstallment0: Boolean(isInstallment0),
        images: images ? (Array.isArray(images) ? images : JSON.parse(images)) : null,
        specs: specs ? (Array.isArray(specs) ? specs : JSON.parse(specs)) : null,
        tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : null,
        description: description || null,
        status: status || "active",
      });

      const created = await Product.findByPk(product.id, {
        include: [{ model: Category, as: "category" }],
      });

      return res.status(201).json({ product: created });
    } catch (error) {
      console.error("Create product error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  // PUT /products/:id
  async update(req, res) {
    try {
      const id = req.params.id;
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const {
        categoryId,
        name,
        slug,
        sku,
        brandName,
        price,
        oldPrice,
        discountPct,
        installmentMonthly,
        stock,
        isFreeship,
        isInstallment0,
        images,
        specs,
        tags,
        description,
        status,
      } = req.body;

      // Check unique slug và sku (nếu thay đổi)
      if (slug && slug !== product.slug) {
        const existingSlug = await Product.findOne({ where: { slug, id: { [Op.ne]: id } } });
        if (existingSlug) {
          return res.status(409).json({ message: "Slug already exists" });
        }
        product.slug = String(slug).trim();
      }

      if (sku && sku !== product.sku) {
        const existingSku = await Product.findOne({ where: { sku, id: { [Op.ne]: id } } });
        if (existingSku) {
          return res.status(409).json({ message: "SKU already exists" });
        }
        product.sku = String(sku).trim();
      }

      // Update fields
      if (categoryId !== undefined) {
        const category = await Category.findByPk(categoryId);
        if (!category) {
          return res.status(404).json({ message: "Category not found" });
        }
        product.categoryId = categoryId;
      }

      if (name !== undefined) product.name = String(name).trim();
      if (brandName !== undefined) product.brandName = brandName ? String(brandName).trim() : null;
      if (price !== undefined) product.price = Number(price);
      if (oldPrice !== undefined) product.oldPrice = oldPrice ? Number(oldPrice) : null;
      if (installmentMonthly !== undefined) product.installmentMonthly = installmentMonthly ? Number(installmentMonthly) : null;
      if (stock !== undefined) product.stock = Number(stock);
      if (isFreeship !== undefined) product.isFreeship = Boolean(isFreeship);
      if (isInstallment0 !== undefined) product.isInstallment0 = Boolean(isInstallment0);
      if (description !== undefined) product.description = description || null;
      if (status !== undefined) product.status = status;

      // Update JSON fields
      if (images !== undefined) {
        product.images = images ? (Array.isArray(images) ? images : JSON.parse(images)) : null;
      }
      if (specs !== undefined) {
        product.specs = specs ? (Array.isArray(specs) ? specs : JSON.parse(specs)) : null;
      }
      if (tags !== undefined) {
        product.tags = tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : null;
      }

      // Tính lại discountPct nếu có oldPrice và price
      if (oldPrice !== undefined || price !== undefined) {
        const finalOldPrice = oldPrice !== undefined ? Number(oldPrice) : product.oldPrice;
        const finalPrice = price !== undefined ? Number(price) : product.price;
        if (finalOldPrice && finalOldPrice > finalPrice) {
          product.discountPct = Math.round(((finalOldPrice - finalPrice) / finalOldPrice) * 100);
        } else if (discountPct !== undefined) {
          product.discountPct = discountPct;
        }
      } else if (discountPct !== undefined) {
        product.discountPct = discountPct;
      }

      await product.save();

      const updated = await Product.findByPk(product.id, {
        include: [{ model: Category, as: "category" }],
      });

      return res.json({ product: updated });
    } catch (error) {
      console.error("Update product error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  // DELETE /products/:id
  async delete(req, res) {
    try {
      const id = req.params.id;
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Check if product is in any orders
      const orderItems = await OrderItem.count({
        where: { productId: id },
      });

      if (orderItems > 0) {
        // Thay vì xóa, set status = inactive
        product.status = "inactive";
        await product.save();
        return res.json({ message: "Product deactivated (has related orders)", product });
      }

      await product.destroy();
      return res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Delete product error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  // PATCH /products/:id/status - Toggle status (ẩn/hiện)
  async toggleStatus(req, res) {
    try {
      const id = req.params.id;
      const { status } = req.body;

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (status && ["active", "inactive", "out_of_stock"].includes(status)) {
        product.status = status;
      } else {
        // Toggle: active -> inactive, inactive -> active, out_of_stock -> active
        if (product.status === "active") {
          product.status = "inactive";
        } else {
          product.status = "active";
        }
      }

      await product.save();

      return res.json({ product });
    } catch (error) {
      console.error("Toggle product status error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
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
