const express = require('express');
const router = express.Router();
const Controller = require('../../controller/game');

router.post('/helloworld', Controller.helloworld)
router.post('/pascal', Controller.pascal)
router.get('/majority/player-url', Controller.getVoteUrl)
router.post('/majority/swipe-rfid', Controller.swipeRFID)


module.exports = router;
