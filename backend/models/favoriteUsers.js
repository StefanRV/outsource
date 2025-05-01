const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');


const FavoriteUser = sequelize.define('FavoriteUser', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  favUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  timestamps: true,
  tableName: 'favoriteUsers',

});

module.exports = FavoriteUser;