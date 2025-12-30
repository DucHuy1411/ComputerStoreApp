const { CartItem, Product } = require("../models");

class CartController {
  // GET /cart
  async getCart(req, res) {
    const userId = req.user.id;
    const items = await CartItem.findAll({
      where: { userId },
      include: [{ model: Product, as: "product" }],
      order: [["id", "DESC"]],
    });

    const subtotal = items.reduce((s, it) => {
      const price = Number(it.product?.price || 0);
      return s + (it.selected ? price * it.qty : 0);
    }, 0);

    return res.json({ items, subtotal, shipping: 0, total: subtotal });
  }

  // POST /cart/items { productId, qty }
  async addItem(req, res) {
    const userId = req.user.id;
    const { productId, qty = 1 } = req.body || {};
    if (!productId) return res.status(400).json({ message: "productId required" });

    const p = await Product.findByPk(productId);
    if (!p) return res.status(404).json({ message: "Product not found" });

    const existed = await CartItem.findOne({ where: { userId, productId } });
    if (existed) {
      existed.qty = Math.max(1, existed.qty + Number(qty));
      existed.selected = true;
      await existed.save();
      return res.json({ item: existed });
    }

    const item = await CartItem.create({ userId, productId, qty: Math.max(1, Number(qty)), selected: true });
    return res.status(201).json({ item });
  }

  // PATCH /cart/items/:id { qty, selected }
  async updateItem(req, res) {
    const userId = req.user.id;
    const id = req.params.id;
    const item = await CartItem.findOne({ where: { id, userId } });
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    const { qty, selected } = req.body || {};
    if (qty !== undefined) item.qty = Math.max(1, Number(qty));
    if (selected !== undefined) item.selected = !!selected;

    await item.save();
    return res.json({ item });
  }

  // DELETE /cart/items/:id
  async removeItem(req, res) {
    const userId = req.user.id;
    const id = req.params.id;
    const item = await CartItem.findOne({ where: { id, userId } });
    if (!item) return res.status(404).json({ message: "Cart item not found" });
    await item.destroy();
    return res.json({ message: "Deleted" });
  }

  // POST /cart/toggle-all { selected: true/false }
  async toggleAll(req, res) {
    const userId = req.user.id;
    const { selected } = req.body || {};
    await CartItem.update({ selected: !!selected }, { where: { userId } });
    return res.json({ message: "OK" });
  }

  // POST /cart/clear
  async clear(req, res) {
    const userId = req.user.id;
    await CartItem.destroy({ where: { userId } });
    return res.json({ message: "Cleared" });
  }
}

module.exports = new CartController();
