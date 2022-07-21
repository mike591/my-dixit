var express = require("express");
var router = express.Router();

const pool = require("server/db");

// try {
//   const response = await pool.query("SELECT * FROM users");
//   console.log(response);
// } catch (error) {
//   console.error(error);
// }

module.exports = router;
