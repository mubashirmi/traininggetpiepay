require('dotenv').config();

const { Sequelize } = require("sequelize");
const mysql2 = require('mysql2')
// Define database connection parameters
const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USER, // Database username
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST, // Database host
    port: process.env.DB_PORT || 3306, // Database port (default to 3306 for MySQL)
    dialect: 'mysql', // Explicitly specify the database dialect
    dialectOptions: {
      connectTimeout: 60000, // Increase the timeout
      ssl: {
        require: true, // Use SSL
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000, // Default acquire timeout
      idle: 10000, // Default idle timeout
    },
  }
);

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
// Call the testConnection function to establish the connection
testConnection();
module.exports = sequelize;
