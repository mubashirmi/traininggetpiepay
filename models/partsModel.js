// models/Parts.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Parts = sequelize.define('Parts', {
    partName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // New field to store the PDF URL
    pdfLink: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Parts;
