const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const SearchTerm = sequelize.define(
  "search_terms",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },

    scope: { type: DataTypes.ENUM("trend", "recent"), allowNull: false },
    term: { type: DataTypes.STRING(160), allowNull: false },
  },
  {
    timestamps: true,
    tableName: "search_terms",
    indexes: [{ unique: true, fields: ["userId", "scope", "term"] }],
  }
);

module.exports = SearchTerm;
