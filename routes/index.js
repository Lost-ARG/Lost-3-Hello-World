var express = require('express');
var router = express.Router();
require('dotenv').config()

const title = process.env.TITLE;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: title });
});

module.exports = router;
