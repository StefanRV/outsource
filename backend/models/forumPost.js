const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ForumPost = sequelize.define('Post', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  votes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  isBestAnswer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  topicId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});


  module.exports = ForumPost;
