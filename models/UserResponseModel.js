const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserResponse = sequelize.define('UserResponse', {
    userAssessmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    selectedOption: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = UserResponse;

