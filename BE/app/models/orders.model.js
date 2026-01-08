const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Order = sequelize.define(
  "orders",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING(32), allowNull: false, unique: true },

    userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    addressId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },

    shipName: { type: DataTypes.STRING(120), allowNull: false },
    shipPhone: { type: DataTypes.STRING(30), allowNull: false },
    shipAddressText: { type: DataTypes.STRING(450), allowNull: false },

    status: {
      type: DataTypes.ENUM("pending", "processing", "shipping", "done", "canceled"),
      allowNull: false,
      defaultValue: "pending",
    },

    shippingMethod: { type: DataTypes.ENUM("standard", "fast", "store"), allowNull: false, defaultValue: "standard" },
    shippingFee: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },

    subtotal: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    discountTotal: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    total: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },

    appliedPromotionId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },

    paymentStatus: {
      type: DataTypes.ENUM("unpaid", "paid", "failed", "refunded"),
      allowNull: false,
      defaultValue: "unpaid",
    },

    paymentMethod: {
      type: DataTypes.ENUM("cod", "vnpay", "bank", "other"),
      allowNull: true,
      defaultValue: null,
    },

    paymentTransactionId: { type: DataTypes.STRING(100), allowNull: true },

    placedAt: { type: DataTypes.DATE(3), allowNull: false, defaultValue: DataTypes.NOW },
  },
  { timestamps: true, tableName: "orders" }
);

module.exports = Order;
