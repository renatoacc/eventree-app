const router = require("express").Router();

//const bcryptjs = require('bcryptjs');
//const saltRounds = 10;

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
