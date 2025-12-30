const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Product = sequelize.define(
  "products",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    categoryId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },

    name: { type: DataTypes.STRING(220), allowNull: false },
    slug: { type: DataTypes.STRING(240), allowNull: false, unique: true },
    sku: { type: DataTypes.STRING(64), allowNull: false, unique: true },
    brandName: { type: DataTypes.STRING(80), allowNull: true },

    price: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    oldPrice: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
    discountPct: { type: DataTypes.INTEGER, allowNull: true },
    installmentMonthly: { type: DataTypes.DECIMAL(15, 2), allowNull: true },

    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    ratingAvg: { type: DataTypes.DECIMAL(3, 2), allowNull: false, defaultValue: 0 },
    reviewsCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },

    isFreeship: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isInstallment0: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

    images: { type: DataTypes.JSON, allowNull: true },
    specs: { type: DataTypes.JSON, allowNull: true },
    tags: { type: DataTypes.JSON, allowNull: true },

    description: { type: DataTypes.TEXT("long"), allowNull: true },

    status: { type: DataTypes.ENUM("active", "inactive", "out_of_stock"), allowNull: false, defaultValue: "active" },
  },
  { timestamps: true, tableName: "products" }
);

module.exports = Product;
