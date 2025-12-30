const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Category = sequelize.define(
  "categories",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    parentId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },

    name: { type: DataTypes.STRING(140), allowNull: false },
    slug: { type: DataTypes.STRING(160), allowNull: false, unique: true },
    icon: { type: DataTypes.STRING(64), allowNull: true },
    hint: { type: DataTypes.STRING(180), allowNull: true },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { timestamps: true, tableName: "categories" }
);

module.exports = Category;
