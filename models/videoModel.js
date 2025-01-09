const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const Video = sequelize.define('Video',{
    videoName : {
        type : DataTypes.STRING,
        allowNull:false
    },
    videoFile : {
        type : DataTypes.STRING,
        allowNull:false
    },
    videoTime : {
        type : DataTypes.STRING,
        allowNull:false
    },
    videoStatus : {
        type : DataTypes.STRING,
        allowNull:false
    },
});

module.exports = Video