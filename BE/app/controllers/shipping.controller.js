const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

class ShippingController {
  // GET /shipping/options
  async options(req, res) {
    const rows = await sequelize.query(
      "SELECT code, name, type, base_fee, eta_text FROM shipping_methods WHERE is_active = 1 ORDER BY sort_order ASC",
      { type: QueryTypes.SELECT }
    );

    const options = rows.map((r) => ({
      code: r.code,
      title: r.name,
      fee: Number(r.base_fee || 0),
      etaText: r.eta_text || "",
      type: r.type || null,
    }));

    return res.json({ options });
  }
}

module.exports = new ShippingController();
