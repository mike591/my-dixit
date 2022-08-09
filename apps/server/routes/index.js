var express = require("express");
var router = express.Router();

router.get("/", async (req, res, next) => {
  console.log(req.headers);
  res.send({ data: "TODO: USER" });
});

module.exports = router;
