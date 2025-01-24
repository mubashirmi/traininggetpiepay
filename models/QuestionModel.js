const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
    assessmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    options: {
        type: DataTypes.TEXT, // Use TEXT to store JSON data as a string
        allowNull: false,
        get() {
            // Parse the JSON string back into an array when retrieving
            const rawValue = this.getDataValue('options');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            // Convert the array into a JSON string when saving
            this.setDataValue('options', JSON.stringify(value));
        },
    },
    correctOption: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Question;
