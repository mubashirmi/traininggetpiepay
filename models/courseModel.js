const sequelize = require("../config/database");
const { DataTypes } =require("sequelize");
const Course = sequelize.define('Course',{
    courseName : {
        type : DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    courseCategory : {
        type : DataTypes.STRING,
        allowNull:false,
    },
    courseThumbnailPhoto : {
        type : DataTypes.STRING,
        allowNull:false,
    },
    courseSummary : {
        type : DataTypes.STRING,
        allowNull:false,
    },
});

module.exports = Course