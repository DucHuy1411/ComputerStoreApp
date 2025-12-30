const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const OrderItem = sequelize.define(
  "order_items",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    orderId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },

    productName: { type: DataTypes.STRING(220), allowNull: false },
    productImageUrl: { type: DataTypes.STRING(1024), allowNull: true },

    unitPrice: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    qty: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    lineTotal: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  },
  { timestamps: true, tableName: "order_items" }
);

module.exports = OrderItem;
