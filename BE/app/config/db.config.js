const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("techstore", "root", "", {
  dialect: "mysql",
  host: "localhost",
  logging: false,
  timezone: "+07:00",
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
});

module.exports = sequelize;
