require('dotenv').config();

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB_DATABASE;
const url = `mongodb://${host}:${port}/${database}`;

const dbConfig = {
  host,
  port,
  database,
  url
}


module.exports = dbConfig;
