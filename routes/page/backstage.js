const express = require('express');
const router = express.Router();
require('dotenv').config()

const title = process.env.TITLE;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('backstage/home', { title: title });
});

router.get('/login', function(req, res, next) {
  res.render('backstage/login', { title: title });
});

router.get('/team-list', function(req, res, next) {
  res.render('backstage/teamList', { title: title });
});

module.exports = router;
