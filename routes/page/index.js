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

// Level 3
router.get('/after-class', function(req, res, next) {
  const subUrl = ['ncnu', 'occult', 'science', 'club'];
  const url = '/after-class/' + subUrl[Math.floor(Math.random() * subUrl.length)];
  res.redirect(url);
});

router.get('/after-class/ncnu', function(req, res, next) {
  res.render('afterClass/ncnu', { title: title });
});

router.get('/after-class/occult', function(req, res, next) {
  res.render('afterClass/occult', { title: title });
});

router.get('/after-class/science', function(req, res, next) {
  res.render('afterClass/science', { title: title });
});

router.get('/after-class/club', function(req, res, next) {
  res.render('afterClass/club', { title: title });
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

// Level 9
router.get('/graduate/sign', function(req, res, next) {
  res.render('graduate/sign', { title: title });
});

router.get('/graduate/tower', function(req, res, next) {
  res.render('graduate/tower', { title: title });
});

// Level 10
router.get('/doom', function(req, res, next) {
  res.render('doom', { title: title });
});

// Level 11
router.get('/book', function(req, res, next) {
  res.render('book', { title: title });
});

// Level 12
router.get('/decision', function(req, res, next) {
  res.render('decision', { title: title });
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

// Level 15
router.get('/handouts', function(req, res, next) {
  res.render('handouts', { title: title });
});

// Level 16
router.get('/maze', function(req, res, next) {
  res.render('maze', { title: title });
});


module.exports = router;
