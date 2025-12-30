const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Notification = sequelize.define(
  "notifications",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },

    type: { type: DataTypes.STRING(40), allowNull: false, defaultValue: "system" },
    title: { type: DataTypes.STRING(140), allowNull: false },
    body: { type: DataTypes.STRING(500), allowNull: true },

    isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    readAt: { type: DataTypes.DATE(3), allowNull: true },

    data: { type: DataTypes.JSON, allowNull: true },
  },
  { timestamps: true, tableName: "notifications" }
);

module.exports = Notification;
