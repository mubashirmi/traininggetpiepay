const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Assessment = sequelize.define('Assessment', {
    partId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = Assessment;
