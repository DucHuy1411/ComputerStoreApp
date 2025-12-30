const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const User = sequelize.define(
  "users",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    fullName: { type: DataTypes.STRING(120), allowNull: true },
    email: { type: DataTypes.STRING(190), allowNull: true, unique: true },
    phone: { type: DataTypes.STRING(30), allowNull: true, unique: true },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    status: { type: DataTypes.ENUM("active", "inactive", "blocked"), allowNull: false, defaultValue: "active" },
    role: { type: DataTypes.ENUM("customer", "admin"), allowNull: false, defaultValue: "customer" },
    avatarUrl: { type: DataTypes.STRING(512), allowNull: true },
    lastLoginAt: { type: DataTypes.DATE(3), allowNull: true },
  },
  { timestamps: true, tableName: "users" }
);

module.exports = User;
