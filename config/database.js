const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('traininggetpie', 'root', 'Malik123$', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;
