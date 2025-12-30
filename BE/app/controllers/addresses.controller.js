const { Address } = require("../models");

class AddressesController {
  // GET /addresses
  async index(req, res) {
    const list = await Address.findAll({
      where: { userId: req.user.id },
      order: [["isDefault", "DESC"], ["id", "DESC"]],
    });
    return res.json({ addresses: list });
  }

  // POST /addresses
  async create(req, res) {
    const userId = req.user.id;
    const {
      recipientName, recipientPhone,
      line1, ward, district, city, province, country,
      type, isDefault,
    } = req.body || {};

    if (!recipientName || !recipientPhone || !line1) {
      return res.status(400).json({ message: "recipientName, recipientPhone, line1 are required" });
    }

    const addr = await Address.create({
      userId,
      recipientName,
      recipientPhone,
      line1,
      ward: ward || null,
      district: district || null,
      city: city || null,
      province: province || null,
      country: country || "VN",
      type: type || "home",
      isDefault: !!isDefault,
    });

    if (addr.isDefault) {
      await Address.update({ isDefault: false }, { where: { userId, id: { $ne: addr.id } } }).catch(() => {});
      // Sequelize v6 không hỗ trợ $ne, dùng workaround:
      await Address.update({ isDefault: false }, { where: { userId } });
      await addr.update({ isDefault: true });
    } else {
      const hasDefault = await Address.count({ where: { userId, isDefault: true } });
      if (hasDefault === 0) await addr.update({ isDefault: true });
    }

    return res.status(201).json({ address: addr });
  }

  // PUT /addresses/:id
  async update(req, res) {
    const id = req.params.id;
    const userId = req.user.id;

    const addr = await Address.findOne({ where: { id, userId } });
    if (!addr) return res.status(404).json({ message: "Address not found" });

    const patch = req.body || {};
    Object.keys(patch).forEach((k) => { addr[k] = patch[k]; });
    await addr.save();

    if (patch.isDefault === true) {
      await Address.update({ isDefault: false }, { where: { userId } });
      await addr.update({ isDefault: true });
    }

    return res.json({ address: addr });
  }

  // DELETE /addresses/:id
  async remove(req, res) {
    const id = req.params.id;
    const userId = req.user.id;

    const addr = await Address.findOne({ where: { id, userId } });
    if (!addr) return res.status(404).json({ message: "Address not found" });

    const wasDefault = !!addr.isDefault;
    await addr.destroy();

    if (wasDefault) {
      const next = await Address.findOne({ where: { userId }, order: [["id", "DESC"]] });
      if (next) await next.update({ isDefault: true });
    }

    return res.json({ message: "Deleted" });
  }

  // POST /addresses/:id/set-default
  async setDefault(req, res) {
    const id = req.params.id;
    const userId = req.user.id;

    const addr = await Address.findOne({ where: { id, userId } });
    if (!addr) return res.status(404).json({ message: "Address not found" });

    await Address.update({ isDefault: false }, { where: { userId } });
    await addr.update({ isDefault: true });

    return res.json({ message: "OK" });
  }
}

module.exports = new AddressesController();
