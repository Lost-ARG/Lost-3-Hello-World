const express = require('express');
const { adminLoginCheck } = require('../../middleware/loginCheck');
const router = express.Router();
require('dotenv').config()

const title = process.env.TITLE + "Backstage";

/* GET home page. */
router.get('/', adminLoginCheck, function(req, res, next) {
  res.render('backstage/home', { title: title });
});

router.get('/login', function(req, res, next) {
  res.render('backstage/login', { title: title });
});

router.get('/team-list', adminLoginCheck, function(req, res, next) {
  res.render('backstage/teamList', { title: title });
});

router.get('/team', adminLoginCheck, function(req, res, next) {
  res.render('backstage/team', { title: title });
});

router.get('/rfid-list', adminLoginCheck, function(req, res, next) {
  res.render('backstage/rfidList', { title: title });
});

router.get('/register-rfid', adminLoginCheck, function(req, res, next) {
  res.render('backstage/registerRFID', { title: title });
});

router.get('/team-payment', adminLoginCheck, function(req, res, next) {
  res.render('backstage/teamPayment', { title: title });
});


module.exports = router;
