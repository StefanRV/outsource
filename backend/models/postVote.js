const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


  const PostVote = sequelize.define('PostVote', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    voteType: {
      type: DataTypes.ENUM('up', 'down'),
      allowNull: false,
    },
  }, {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'postId'], // Ensure a user can only vote once per post
      },
    ],
  });

module.exports = PostVote;
