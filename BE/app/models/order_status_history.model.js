const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const OrderStatusHistory = sequelize.define(
  "order_status_history",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    orderId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },

    status: { type: DataTypes.ENUM("pending", "processing", "shipping", "done", "canceled"), allowNull: false },
    title: { type: DataTypes.STRING(120), allowNull: false },
    description: { type: DataTypes.STRING(255), allowNull: true },
    happenedAt: { type: DataTypes.DATE(3), allowNull: false, defaultValue: DataTypes.NOW },
  },
  { timestamps: true, tableName: "order_status_history" }
);

module.exports = OrderStatusHistory;
