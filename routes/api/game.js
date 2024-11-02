const express = require('express');
const router = express.Router();
const Controller = require('../../controller/game');

router.post('/helloworld', Controller.helloworld)
router.post('/morning', Controller.morning)
router.post('/pascal', Controller.pascal)
router.get('/majority/player-url', Controller.getVoteUrl)
router.post('/majority/swipe-rfid', Controller.swipeRFID)
router.post('/read-chip/detect-rfid', Controller.detectRFID)
router.post('/hex', Controller.hex)
router.post('/snake', Controller.snake)
router.post('/tomb', Controller.tomb);
router.post('/maze', Controller.maze);
router.post('/graduate', Controller.graduate);


module.exports = router;
