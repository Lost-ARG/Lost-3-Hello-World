const express = require('express');
const router = express.Router();
const Controller = require('../../controller/game');
const { actTimeCheck } = require('../../middleware/timeCheck');

router.post('/helloworld', actTimeCheck, Controller.helloworld)
router.post('/morning', actTimeCheck, Controller.morning)
router.post('/pascal', actTimeCheck, Controller.pascal)
router.get('/majority/player-url', Controller.getVoteUrl)
router.post('/majority/swipe-rfid', Controller.swipeRFID)
router.post('/read-chip/detect-rfid', Controller.detectRFID)
router.post('/hex', actTimeCheck, Controller.hex)
router.post('/snake', actTimeCheck, Controller.snake)
router.post('/tomb', actTimeCheck, Controller.tomb);
router.post('/maze', actTimeCheck, Controller.maze);
router.post('/graduate', actTimeCheck, Controller.graduate);
router.post('/doom', actTimeCheck, Controller.doom);
router.post('/handouts', actTimeCheck, Controller.handouts);


module.exports = router;
