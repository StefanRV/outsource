const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Topic = require("./topic");

const ForumCategory = sequelize.define(
  "ForumCategory",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = ForumCategory;
