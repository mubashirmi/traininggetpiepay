const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserPartPdfStatus = sequelize.define('UserPartPdfStatus', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    partId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // The status will be 'unseen' by default and updated to 'seen'
    pdfStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'unseen'
    }
});

module.exports = UserPartPdfStatus;
