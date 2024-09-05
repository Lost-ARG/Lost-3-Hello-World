const express = require('express');
const router = express.Router();

const backstageRouter = require('./backstage')

require('dotenv').config()

const title = process.env.TITLE;

router.use('/backstage', backstageRouter);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: title });
});

router.get('/signUp', function(req, res, next) {
  res.render('signUp', { title: title });
});

router.get('/helloworld', function(req, res, next) {
  res.render('helloworld', { title: title });
});

module.exports = router;
