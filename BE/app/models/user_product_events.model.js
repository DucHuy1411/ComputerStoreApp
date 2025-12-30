const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const UserProductEvent = sequelize.define(
  "user_product_events",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },

    type: { type: DataTypes.ENUM("favorite", "recent"), allowNull: false },
    lastSeenAt: { type: DataTypes.DATE(3), allowNull: true },
  },
  {
    timestamps: true,
    tableName: "user_product_events",
    indexes: [{ unique: true, fields: ["userId", "productId", "type"] }],
  }
);

module.exports = UserProductEvent;
