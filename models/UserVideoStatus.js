const sequelize = require("../config/database"); 
const { DataTypes } = require("sequelize");

const UserVideoStatus = sequelize.define('UserVideoStatus',{
    status : {
        type : DataTypes.STRING,
        allowNull : false ,
        defaultValue : 'notStarted'
    }
});

module.exports = UserVideoStatus;