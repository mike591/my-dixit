var express = require("express");
var router = express.Router();

// TODO: make sure user exists in cookies/headers, create a new user if doesn't exists
router.get("/", async (req, res, next) => {
  console.log(req.headers);
  res.send({ data: "TODO: USER" });
});

module.exports = router;
