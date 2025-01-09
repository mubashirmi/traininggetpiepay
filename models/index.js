const sequelize = require('../config/database');
const Course = require('./courseModel');
const Part = require('./partsModel');
const Video = require('./videoModel');

// Define associations AFTER requiring all models
Course.hasMany(Part, { foreignKey: 'courseId' });
Part.belongsTo(Course, { foreignKey: 'courseId' });

Part.hasMany(Video, { foreignKey: 'partId' });
Video.belongsTo(Part, { foreignKey: 'partId' });

module.exports = { sequelize, Course, Part, Video };
