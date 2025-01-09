const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Parts = sequelize.define('Parts',{
    partName : {
        type : DataTypes.STRING,
        allowNull : false
    }
})

module.exports = Parts;