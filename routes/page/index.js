const express = require('express');
const router = express.Router();

const backstageRouter = require('./backstage');
const { verify } = require('../../service/jwtService');

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

router.get('/verify-email', function(req, res, next) {
  res.render('verifyEmail', { title: title });
});

router.get('/helloworld', function(req, res, next) {
  res.render('helloworld', { title: title });
});

// Level 1
router.get('/morning', function(req, res, next) {
  res.render('morning', { title: title, soundUrl: process.env.LEVEL_1_SOUND_URL });
});

// Level 2
router.get('/pascal', function(req, res, next) {
  res.render('pascal', { title: title });
});

router.get('/story', function(req, res, next) {
  res.render('story', { title: title });
});

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

router.get('/readChip/idle', function(req, res, next) {
  res.render('readChip/idle', { title: title });
});

router.get('/readChip/data', function(req, res, next) {
  res.render('readChip/data', { title: title });
});

router.get('/hex', function(req, res, next) {
  res.render('hex', { title: title });
});

router.get('/goto', function(req, res, next) {
  res.render('goto', { title: title });
});

router.get('/snake', function(req, res, next) {
  res.render('snake', { title: title });
});

router.get('/tomb', function(req, res, next) {
  res.render('tomb', { title: title });
});


module.exports = router;
