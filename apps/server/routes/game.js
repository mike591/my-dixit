var express = require("express");
var router = express.Router();

/* GET game page. */
router.get("/", function (req, res, next) {
  res.send({ data: "TODO: GAME routes" });
});

module.exports = router;
