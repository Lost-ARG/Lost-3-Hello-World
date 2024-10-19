const express = require('express');
const router = express.Router();
require('dotenv').config()

const title = process.env.TITLE;

/* GET home page. */
router.get('/', function(req, res, next) {
  const teamCode = req.query["team"];
  if(!teamCode) {
    res.redirect('/player/login');
    return;
  }
  if(teamCode !== req.session.teamCode) {
    res.redirect('/player/login');
    return;
  }
  res.render('player/home', { title: title });
});

router.get('/login', function(req, res, next) {
  res.render('player/login', { title: title });
});


module.exports = router;
