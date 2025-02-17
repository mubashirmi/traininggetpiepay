const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const UserVideoStatus = sequelize.define('UserVideoStatus', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  videoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'notStarted'
  },
  // New field to track the current playback time in seconds
  currentTime: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  }
});

module.exports = UserVideoStatus;