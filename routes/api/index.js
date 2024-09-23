var express = require('express');
var router = express.Router();

const teamRouter = require('./team');
const storyRouter = require('./story');
const gameRouter = require('./game');
const backstageRouter = require('./backstage');
const Controller = require('../../controller/signUp');


router.use('/team', teamRouter);
router.use('/story', storyRouter);
router.use('/game', gameRouter);
router.use('/backstage', backstageRouter);

router.post('/signUp', Controller.signUp)

module.exports = router;
