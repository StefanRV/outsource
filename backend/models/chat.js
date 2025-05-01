const User = require('./user');
const Message = require('./message');
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: User,
        key: 'id',
      },
  },
  user2Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: User,
        key: 'id',
      },
  }
,

}, {
  timestamps: true,
});

module.exports = Chat;