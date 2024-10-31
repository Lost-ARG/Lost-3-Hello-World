const express = require('express');
const router = express.Router();

const backstageRouter = require('./backstage');
const playerRouter = require('./player');
const { verify } = require('../../service/jwtService');

require('dotenv').config()

const title = process.env.TITLE;

router.use('/backstage', backstageRouter);
router.use('/player', playerRouter);

// General
router.get('/', function(req, res, next) {
  res.render('index', { title: title });
});

router.get('/sign-up', function(req, res, next) {
  res.render('signUp', { title: title });
});

router.get('/verify-email', function(req, res, next) {
  res.render('verifyEmail', { title: title });
});

router.get('/story', function(req, res, next) {
  res.render('story', { title: title });
});

router.get('/goto', function(req, res, next) {
  res.render('goto', { title: title });
});

// Level -1
router.get('/helloworld', function(req, res, next) {
  res.render('helloworld', { title: title });
});

// Level 1
router.get('/morning', function(req, res, next) {
  res.render('morning', { title: title, sourceUrl: process.env.LEVEL_1_SOURCE_URL });
});

// Level 2
router.get('/pascal', function(req, res, next) {
  res.render('pascal', { title: title });
});

// Level 4
router.get('/read-chip/idle', function(req, res, next) {
  res.render('readChip/idle', { title: title });
});

router.get('/read-chip/data', function(req, res, next) {
  res.render('readChip/data', { title: title });
});

// Level 5
router.get('/hex', function(req, res, next) {
  res.render('hex', { title: title });
});

// Level 6
router.get('/tomb', function(req, res, next) {
  res.render('tomb', { title: title });
});

// Level 7
router.get('/loop', function(req, res, next) {
  res.render('loop', { title: title, sourceUrl: process.env.LEVEL_7_SOURCE_URL });
});

// Level 8
router.get('/weird', function(req, res, next) {
  res.render('weird', { title: title, sourceUrl: process.env.LEVEL_8_SOURCE_URL });
});

// Level 13
router.get('/majority/board', function(req, res, next) {
  res.render('majority/board', { title: title });
});

router.get('/majority/player', async function(req, res, next) {
  const {token} = req.query;
  const tokenVerifyResult = await verify(token);
  
  if(!tokenVerifyResult) {
    next();
    return
  }
  res.render('majority/player', { title: title });
});

// Level 14
router.get('/snake', function(req, res, next) {
  res.render('snake', { title: title });
});

// Level 16
router.get('/maze', function(req, res, next) {
  res.render('maze', { title: title });
});


module.exports = router;
