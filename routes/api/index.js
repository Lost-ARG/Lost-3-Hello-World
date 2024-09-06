var express = require('express');
var router = express.Router();
const gameRouter = require('./game');
const backstageRouter = require('./backstage');
const Controller = require('../../controller/signUp');


router.use('/game', gameRouter);
router.use('/backstage', backstageRouter);

router.post('/signUp', Controller.signUp)

module.exports = router;
