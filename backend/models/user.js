const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },        
    username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
    passwords: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'moderator', 'user'),
        defaultValue: 'user'
    },

}, {
    timestamps: true,
    tableName: 'users',
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.passwords = await bcrypt.hash(user.passwords, salt);
        },
        beforeUpdate: async (user) => {
            if (user.changed('passwords')) {
                const salt = await bcrypt.genSalt(10);
                user.passwords = await bcrypt.hash(user.passwords, salt);
            }
        }
    }
});

module.exports = User;
