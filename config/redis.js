require('dotenv').config();

const config = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};

module.exports = config;
