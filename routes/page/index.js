const express = require('express');
const router = express.Router();

const backstageRouter = require('./backstage');
const playerRouter = require('./player');
const { verify } = require('../../service/jwtService');
const openingHours = require('../../config/openingHours');
const { actTimeCheck } = require('../../middleware/timeCheck');

require('dotenv').config()

const title = process.env.TITLE;

router.use('/backstage', backstageRouter);
router.use('/player', playerRouter);

// General
router.get('/', function(req, res, next) {
  res.render('index', { title: title });
});

router.get('/ending', actTimeCheck, function(req, res, next) {
  res.render('ending', { title: title, ending_url: process.env.ENDING_URL });
});

router.get('/ranking', function(req, res, next) {
  res.render('ranking', { title: title });
});

router.get('/info', function(req, res, next) {
  res.render('home/info', { title: title });
});

router.get('/notice-list', function(req, res, next) {
  res.render('home/noticeList', { title: title });
});

router.get('/notice', function(req, res, next) {
  res.render('home/notice', { title: title });
});

router.get('/faq', function(req, res, next) {
  res.render('home/faq', { title: title });
});

router.get('/terms', function(req, res, next) {
  res.render('home/terms', { title: title });
});

router.get('/disclaimer', function(req, res, next) {
  res.render('home/disclaimer', { title: title });
});

router.get('/sign-up', function(req, res, next) {
  res.render('signUp', { title: title });
});

router.get('/verify-email', function(req, res, next) {
  res.render('verifyEmail', { title: title });
});

router.get('/story', actTimeCheck, function(req, res, next) {
  res.render('story', { title: title });
});

router.get('/goto', actTimeCheck, function(req, res, next) {
  res.render('goto', { title: title });
});

// Level -1
router.get('/helloworld', function(req, res, next) {
  res.render('helloworld', { title: title });
});

// Level 1
router.get('/morning', actTimeCheck, function(req, res, next) {
  res.render('morning', { title: title, sourceUrl: process.env.LEVEL_1_SOURCE_URL });
});

// Level 2
router.get('/pascal', actTimeCheck, function(req, res, next) {
  res.render('pascal', { title: title });
});

// Level 3
router.get('/after-class', actTimeCheck, function(req, res, next) {
  const subUrl = ['ncnu', 'occult', 'science', 'club'];
  const url = '/after-class/' + subUrl[Math.floor(Math.random() * subUrl.length)];
  res.render("afterClass/afterClass", { title, openingHours: openingHours.level_3, url });
});

router.get('/after-class/ncnu', actTimeCheck, function(req, res, next) {
  res.render('afterClass/ncnu', { title: title });
});

router.get('/after-class/occult', actTimeCheck, function(req, res, next) {
  res.render('afterClass/occult', { title: title });
});

router.get('/after-class/science', actTimeCheck, function(req, res, next) {
  res.render('afterClass/science', { title: title });
});

router.get('/after-class/club', actTimeCheck, function(req, res, next) {
  res.render('afterClass/club', { title: title });
});

// Level 4
router.get('/read-chip/idle', actTimeCheck, function(req, res, next) {
  res.render('readChip/idle', { title: title });
});

router.get('/read-chip/data', actTimeCheck, function(req, res, next) {
  res.render('readChip/data', { title: title, storyCode: process.env.LEVEL_4_STORY_CODE });
});

// Level 5
router.get('/hex', actTimeCheck, function(req, res, next) {
  res.render('hex', { title: title });
});

// Level 6
router.get('/tomb', actTimeCheck, function(req, res, next) {
  res.render('tomb', { title: title, openingHours: openingHours.level_6 });
});

// Level 7
router.get('/loop', actTimeCheck, function(req, res, next) {
  res.render('loop', { title: title, sourceUrl: process.env.LEVEL_7_SOURCE_URL });
});

// Level 8
router.get('/weird', actTimeCheck, function(req, res, next) {
  res.render('weird', { title: title, sourceUrl: process.env.LEVEL_8_SOURCE_URL });
});

// Level 9
router.get('/graduate/sign', actTimeCheck, function(req, res, next) {
  res.render('graduate/sign', { title: title });
});

router.get('/graduate/tower', actTimeCheck, function(req, res, next) {
  res.render('graduate/tower', { title: title });
});

// Level 10
router.get('/doom', actTimeCheck, function(req, res, next) {
  res.render('doom', { title: title });
});

// Level 11
router.get('/book', actTimeCheck, function(req, res, next) {
  res.render('book', { title: title, openingHours: openingHours.level_11 });
});

// Level 13
router.get('/decision', actTimeCheck, function(req, res, next) {
  res.render('decision', { title: title, openingHours: openingHours.level_13 });
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

// Level 14
router.get('/snake', actTimeCheck, function(req, res, next) {
  res.render('snake', { title: title });
});

// Level 15
router.get('/handouts', actTimeCheck, function(req, res, next) {
  res.render('handouts', { title: title, openingHours: openingHours.level_15 });
});

// Level 16
router.get('/maze', actTimeCheck, function(req, res, next) {
  res.render('maze', { title: title });
});

// Level 17
router.get('/pov', actTimeCheck, function(req, res, next) {
  res.render('pov', { title: title });
});

// Level 18
router.get('/almost', actTimeCheck, function(req, res, next) {
  res.render('almost', { title: title });
});

router.get('/last', actTimeCheck, function(req, res, next) {
  res.render('last', { title: title, storyCode: process.env.LEVEL_18_STORY_CODE });
});


module.exports = router;
