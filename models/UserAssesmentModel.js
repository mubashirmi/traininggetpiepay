const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserAssessment = sequelize.define('UserAssessment', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    partId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: true, // Nullable until assessment is completed
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending', // Default status is "pending"
    },
});

module.exports = UserAssessment;
