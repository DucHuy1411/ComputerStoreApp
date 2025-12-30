const { sequelize, Order, OrderItem, OrderStatusHistory, CartItem, Product, Address, Promotion } = require("../models");
const { Op } = require("sequelize");
const { genOrderCode } = require("../utils/order.util");

class OrdersController {
  // GET /orders (filters: status, q, minTotal, maxTotal, fromDate, toDate, sort)
  async index(req, res) {
    const userId = req.user.id;
    const { status, q, minTotal, maxTotal, fromDate, toDate, sort = "newest" } = req.query;

    const where = { userId };
    if (status && status !== "all") where.status = status;

    if (minTotal) where.total = { ...(where.total || {}), [Op.gte]: Number(minTotal) };
    if (maxTotal) where.total = { ...(where.total || {}), [Op.lte]: Number(maxTotal) };
    if (fromDate) where.placedAt = { ...(where.placedAt || {}), [Op.gte]: new Date(fromDate) };
    if (toDate) where.placedAt = { ...(where.placedAt || {}), [Op.lte]: new Date(toDate) };

    const order = (() => {
      if (sort === "oldest") return [["placedAt", "ASC"]];
      if (sort === "priceAsc") return [["total", "ASC"]];
      if (sort === "priceDesc") return [["total", "DESC"]];
      return [["placedAt", "DESC"]];
    })();

    const list = await Order.findAll({
      where,
      order,
      include: [{ model: OrderItem, as: "items", attributes: ["id", "productName", "productImageUrl", "qty", "unitPrice"] }],
    });

    // q search: code/status/productName (lọc ở app cho đơn giản)
    const query = (q || "").trim().toLowerCase();
    const filtered = query
      ? list.filter((o) => {
          const hay = [
            o.code,
            o.status,
            ...(o.items || []).map((it) => it.productName),
          ].join(" ").toLowerCase();
          return hay.includes(query);
        })
      : list;

    return res.json({ orders: filtered });
  }

  // GET /orders/:id
  async detail(req, res) {
    const userId = req.user.id;
    const id = req.params.id;

    const order = await Order.findOne({
      where: { id, userId },
      include: [
        { model: OrderItem, as: "items" },
        { model: OrderStatusHistory, as: "history", order: [["happenedAt", "ASC"]] },
      ],
    });

    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json({ order });
  }

  // POST /orders/checkout-from-cart
  // body: { addressId, shippingMethod, promotionCode }
  async checkoutFromCart(req, res) {
    const userId = req.user.id;
    const { addressId, shippingMethod = "standard", promotionCode } = req.body || {};

    const address = await Address.findOne({ where: { id: addressId, userId } });
    if (!address) return res.status(400).json({ message: "Invalid addressId" });

    const cart = await CartItem.findAll({
      where: { userId, selected: true },
      include: [{ model: Product, as: "product" }],
    });
    if (cart.length === 0) return res.status(400).json({ message: "No selected items in cart" });

    let promo = null;
    if (promotionCode) {
      promo = await Promotion.findOne({ where: { type: "voucher", isActive: true, code: promotionCode } });
    }

    const t = await sequelize.transaction();
    try {
      const code = genOrderCode();

      const shipAddressText = [
        address.line1,
        address.ward,
        address.district,
        address.city || address.province,
      ].filter(Boolean).join(", ");

      const itemsPayload = cart.map((c) => {
        const unitPrice = Number(c.product.price || 0);
        const qty = c.qty;

        return {
          productId: c.productId,
          productName: c.product.name,
          productImageUrl: c.product.images || null,
          unitPrice,
          qty,
          lineTotal: unitPrice * qty,
        };
      });

      const subtotal = itemsPayload.reduce((s, it) => s + it.lineTotal, 0);

      let discountTotal = 0;
      let appliedPromotionId = null;
      if (promo) {
        if (subtotal >= Number(promo.minOrderAmount || 0)) {
          appliedPromotionId = promo.id;
          if (promo.discountType === "amount") discountTotal = Math.min(subtotal, Number(promo.discountValue || 0));
          if (promo.discountType === "percent") discountTotal = Math.floor((subtotal * Number(promo.discountValue || 0)) / 100);
        }
      }

      const shippingFee = shippingMethod === "fast" ? 50000 : 0;
      const total = Math.max(0, subtotal - discountTotal) + shippingFee;

      const order = await Order.create(
        {
          code,
          userId,
          addressId: address.id,
          shipName: address.recipientName,
          shipPhone: address.recipientPhone,
          shipAddressText,
          status: "pending",
          shippingMethod,
          shippingFee,
          subtotal,
          discountTotal,
          total,
          appliedPromotionId,
          paymentStatus: "unpaid",
          placedAt: new Date(),
        },
        { transaction: t }
      );

      await OrderItem.bulkCreate(
        itemsPayload.map((x) => ({ ...x, orderId: order.id })),
        { transaction: t }
      );

      await OrderStatusHistory.create(
        {
          orderId: order.id,
          status: "pending",
          title: "Đặt hàng",
          description: "Đơn hàng đã được đặt thành công",
          happenedAt: new Date(),
        },
        { transaction: t }
      );

      // clear selected cart items
      await CartItem.destroy({ where: { userId, selected: true }, transaction: t });

      await t.commit();
      return res.status(201).json({ orderId: order.id, code: order.code });
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  // POST /orders/buy-now
  // body: { productId, qty, addressId, shippingMethod, promotionCode }
  async buyNow(req, res) {
    const userId = req.user.id;
    const { productId, qty = 1, addressId, shippingMethod = "standard", promotionCode } = req.body || {};
    if (!productId || !addressId) return res.status(400).json({ message: "productId and addressId required" });

    const [product, address] = await Promise.all([
      Product.findByPk(productId),
      Address.findOne({ where: { id: addressId, userId } }),
    ]);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (!address) return res.status(400).json({ message: "Invalid addressId" });

    let promo = null;
    if (promotionCode) promo = await Promotion.findOne({ where: { type: "voucher", isActive: true, code: promotionCode } });

    const t = await sequelize.transaction();
    try {
      const code = genOrderCode();

      const shipAddressText = [
        address.line1,
        address.ward,
        address.district,
        address.city || address.province,
      ].filter(Boolean).join(", ");

      const unitPrice = Number(product.price || 0);
      const qn = Math.max(1, Number(qty));
      const subtotal = unitPrice * qn;

      let discountTotal = 0;
      let appliedPromotionId = null;
      if (promo && subtotal >= Number(promo.minOrderAmount || 0)) {
        appliedPromotionId = promo.id;
        if (promo.discountType === "amount") discountTotal = Math.min(subtotal, Number(promo.discountValue || 0));
        if (promo.discountType === "percent") discountTotal = Math.floor((subtotal * Number(promo.discountValue || 0)) / 100);
      }

      const shippingFee = shippingMethod === "fast" ? 50000 : 0;
      const total = Math.max(0, subtotal - discountTotal) + shippingFee;

      const order = await Order.create(
        {
          code,
          userId,
          addressId: address.id,
          shipName: address.recipientName,
          shipPhone: address.recipientPhone,
          shipAddressText,
          status: "pending",
          shippingMethod,
          shippingFee,
          subtotal,
          discountTotal,
          total,
          appliedPromotionId,
          paymentStatus: "unpaid",
          placedAt: new Date(),
        },
        { transaction: t }
      );

      await OrderItem.create(
        {
          orderId: order.id,
          productId: product.id,
          productName: product.name,
          productImageUrl: product.images,
          unitPrice,
          qty: qn,
          lineTotal: subtotal,
        },
        { transaction: t }
      );

      await OrderStatusHistory.create(
        {
          orderId: order.id,
          status: "pending",
          title: "Đặt hàng",
          description: "Đơn hàng đã được đặt thành công",
          happenedAt: new Date(),
        },
        { transaction: t }
      );

      await t.commit();
      return res.status(201).json({ orderId: order.id, code: order.code });
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  // POST /orders/:id/cancel
  async cancel(req, res) {
    const userId = req.user.id;
    const id = req.params.id;

    const order = await Order.findOne({ where: { id, userId } });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (["done", "canceled"].includes(order.status)) return res.status(400).json({ message: "Cannot cancel this order" });

    order.status = "canceled";
    await order.save();

    await OrderStatusHistory.create({
      orderId: order.id,
      status: "canceled",
      title: "Hủy đơn",
      description: "Đơn hàng đã bị hủy",
      happenedAt: new Date(),
    });

    return res.json({ message: "Canceled" });
  }
}

module.exports = new OrdersController();
