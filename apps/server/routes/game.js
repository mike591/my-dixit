var express = require("express");
var router = express.Router();

/* GET game */
router.get("/:id?", function (req, res, next) {
  console.log(req.params);
  res.send({ data: "TODO: GAME routes" });
});

// CREATE game

// UPDATE game

module.exports = router;
