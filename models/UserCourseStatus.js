const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserCourseStatus = sequelize.define('UserCourseStatus',{
    status : {
        type : DataTypes.STRING,
        allowNull : false,
        defaultValue : "notStarted"
    }
})
module.exports = UserCourseStatus;
