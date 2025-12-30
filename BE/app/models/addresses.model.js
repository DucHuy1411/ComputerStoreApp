const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Address = sequelize.define(
  "addresses",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },

    recipientName: { type: DataTypes.STRING(120), allowNull: false },
    recipientPhone: { type: DataTypes.STRING(30), allowNull: false },

    line1: { type: DataTypes.STRING(255), allowNull: false },
    ward: { type: DataTypes.STRING(120), allowNull: true },
    district: { type: DataTypes.STRING(120), allowNull: true },
    city: { type: DataTypes.STRING(120), allowNull: true },
    province: { type: DataTypes.STRING(120), allowNull: true },
    country: { type: DataTypes.STRING(2), allowNull: false, defaultValue: "VN" },

    type: { type: DataTypes.ENUM("home", "work", "other"), allowNull: false, defaultValue: "home" },
    isDefault: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { timestamps: true, tableName: "addresses" }
);

module.exports = Address;
