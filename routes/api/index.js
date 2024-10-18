var express = require('express');
var router = express.Router();

const jwtRouter = require('./jwt');
const teamRouter = require('./team');
const storyRouter = require('./story');
const gameRouter = require('./game');
const backstageRouter = require('./backstage');
const playerRouter = require('./player');
const signUpRouter = require('./signUp');


router.use('/jwt', jwtRouter);
router.use('/team', teamRouter);
router.use('/story', storyRouter);
router.use('/game', gameRouter);
router.use('/backstage', backstageRouter);
router.use('/player', playerRouter);
router.use('/signUp', signUpRouter)


module.exports = router;
