var express = require('express');
var router = express.Router();
const gameRouter = require('./game');
const Controller = require('../controller/api');


router.use('/game', gameRouter);
router.post('/signUp', Controller.signUp)

module.exports = router;
