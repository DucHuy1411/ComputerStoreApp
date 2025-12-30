const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const PromotionItem = sequelize.define(
  "promotion_items",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    promotionId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },

    discountPct: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    stockLimit: { type: DataTypes.INTEGER, allowNull: true },
    soldCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    timestamps: true,
    tableName: "promotion_items",
    indexes: [{ unique: true, fields: ["promotionId", "productId"] }],
  }
);

module.exports = PromotionItem;
