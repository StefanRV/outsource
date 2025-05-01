const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');
const Chat = require('./chat');

    const Message = sequelize.define('Message', {
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      chatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Chat,
          key: 'id',
        },
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: 'id',
        },
      },

      ifRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },{
      timestamps: true,
    })
  
  
  
    module.exports = Message;
  
  