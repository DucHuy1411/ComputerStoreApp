const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const CartItem = sequelize.define(
  "cart_items",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },

    qty: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    selected: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    timestamps: true,
    tableName: "cart_items",
    indexes: [{ unique: true, fields: ["userId", "productId"] }],
  }
);

module.exports = CartItem;
