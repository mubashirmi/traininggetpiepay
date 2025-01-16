const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserPartStatus = sequelize.define('UserPartStatus',{
    status : {
        type : DataTypes.STRING,
        allowNull : false,
        defaultValue : 'notStarted'
    }
});

module.exports = UserPartStatus;