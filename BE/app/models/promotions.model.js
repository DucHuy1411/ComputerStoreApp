const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Promotion = sequelize.define(
  "promotions",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    type: { type: DataTypes.ENUM("voucher", "flash_sale"), allowNull: false },
    title: { type: DataTypes.STRING(160), allowNull: false },

    code: { type: DataTypes.STRING(40), allowNull: true, unique: true },
    discountType: { type: DataTypes.ENUM("amount", "percent"), allowNull: true },
    discountValue: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
    minOrderAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },

    startsAt: { type: DataTypes.DATE(3), allowNull: true },
    endsAt: { type: DataTypes.DATE(3), allowNull: true },

    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    data: { type: DataTypes.JSON, allowNull: true },
  },
  { timestamps: true, tableName: "promotions" }
);

module.exports = Promotion;
