const sequelize = require('../config/database');
const User = require('./User');
const Course = require('./courseModel');
const Part = require('./partsModel');
const Video = require('./videoModel');
const UserCourseStatus = require('./UserCourseStatus');
const UserPartStatus = require('./UserPartStatus');
const UserVideoStatus = require('./UserVideoStatus');
const Assessment = require('./AssesmentModel');
const Question = require('./QuestionModel');
const UserAssessment = require('./UserAssesmentModel');
const UserResponse = require('./UserResponseModel');
const UserPartPdfStatus = require('./UserPartPdfStatus');

// User-Course Association through UserCourseStatus
User.belongsToMany(Course, { 
    through: UserCourseStatus, 
    foreignKey: 'userId', 
    otherKey: 'courseId' 
});
Course.belongsToMany(User, { 
    through: UserCourseStatus, 
    foreignKey: 'courseId', 
    otherKey: 'userId' 
});

// Explicitly define associations for UserCourseStatus
UserCourseStatus.belongsTo(User, { foreignKey: 'userId' });
UserCourseStatus.belongsTo(Course, { foreignKey: 'courseId' });
User.hasMany(UserCourseStatus, { foreignKey: 'userId' });
Course.hasMany(UserCourseStatus, { foreignKey: 'courseId' });

// Course-Part Association
Course.hasMany(Part, { foreignKey: 'courseId' });
Part.belongsTo(Course, { foreignKey: 'courseId' });

// Part-Video Association
Part.hasMany(Video, { foreignKey: 'partId' });
Video.belongsTo(Part, { foreignKey: 'partId' });

// User-Part Association through UserPartStatus
User.belongsToMany(Part, { 
    through: UserPartStatus, 
    foreignKey: 'userId', 
    otherKey: 'partId' 
});
Part.belongsToMany(User, { 
    through: UserPartStatus, 
    foreignKey: 'partId', 
    otherKey: 'userId' 
});

// Explicitly define associations for UserPartStatus
UserPartStatus.belongsTo(User, { foreignKey: 'userId' });
UserPartStatus.belongsTo(Part, { foreignKey: 'partId' });
User.hasMany(UserPartStatus, { foreignKey: 'userId' });
Part.hasMany(UserPartStatus, { foreignKey: 'partId' });

// User-Video Association through UserVideoStatus
User.belongsToMany(Video, { 
    through: UserVideoStatus, 
    foreignKey: 'userId', 
    otherKey: 'videoId' 
});
Video.belongsToMany(User, { 
    through: UserVideoStatus, 
    foreignKey: 'videoId', 
    otherKey: 'userId' 
});

// Explicitly define associations for UserVideoStatus
UserVideoStatus.belongsTo(User, { foreignKey: 'userId' });
UserVideoStatus.belongsTo(Video, { foreignKey: 'videoId' });
User.hasMany(UserVideoStatus, { foreignKey: 'userId' });
Video.hasMany(UserVideoStatus, { foreignKey: 'videoId' });


// Associations for assessments and parts
Assessment.belongsTo(Part, { foreignKey: 'partId' });
Part.hasOne(Assessment, { foreignKey: 'partId' });

// Associations for questions and assessments
Question.belongsTo(Assessment, { foreignKey: 'assessmentId' });
Assessment.hasMany(Question, { foreignKey: 'assessmentId' });

// Associations for user assessments and parts
UserAssessment.belongsTo(Part, { foreignKey: 'partId' });
Part.hasMany(UserAssessment, { foreignKey: 'partId' });

// Associations for user assessments and users
UserAssessment.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(UserAssessment, { foreignKey: 'userId' });

// Associations for user responses and questions
UserResponse.belongsTo(Question, { foreignKey: 'questionId' });
Question.hasMany(UserResponse, { foreignKey: 'questionId' });

// Associations for user responses and user assessments
UserResponse.belongsTo(UserAssessment, { foreignKey: 'userAssessmentId' });
UserAssessment.hasMany(UserResponse, { foreignKey: 'userAssessmentId' });

// New associations for PDF status:
// We want to track, for each user and part, the PDF view status.
// A many-to-many style association using a through table:
User.belongsToMany(Part, { through: UserPartPdfStatus, foreignKey: 'userId', otherKey: 'partId' });
Part.belongsToMany(User, { through: UserPartPdfStatus, foreignKey: 'partId', otherKey: 'userId' });

// Optionally, if you want to access these relationships directly:
UserPartPdfStatus.belongsTo(User, { foreignKey: 'userId' });
UserPartPdfStatus.belongsTo(Part, { foreignKey: 'partId' });
User.hasMany(UserPartPdfStatus, { foreignKey: 'userId' });
Part.hasMany(UserPartPdfStatus, { foreignKey: 'partId' });

module.exports = { 
    sequelize, 
    User,
    Course,
    Part,
    Video,
    UserCourseStatus,
    UserPartStatus,
    UserPartPdfStatus,
    UserVideoStatus,
    Assessment,
    Question,
    UserAssessment,
    UserResponse 
};
