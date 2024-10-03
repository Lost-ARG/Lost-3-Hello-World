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

router.get('/team', function(req, res, next) {
  res.render('backstage/team', { title: title });
});

router.get('/rfid-list', function(req, res, next) {
  res.render('backstage/rfidList', { title: title });
});

router.get('/register-rfid', function(req, res, next) {
  res.render('backstage/registerRFID', { title: title });
});

module.exports = router;
