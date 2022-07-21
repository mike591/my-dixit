const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "Mike591!",
  database: "mydixit",
  host: "localhost",
  port: 5432,
});

module.exports = pool;
