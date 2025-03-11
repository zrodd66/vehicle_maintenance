const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

// Export environment configuration
module.exports = {
  port: process.env.PORT || 3000,
  dbConfig: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h'
};
