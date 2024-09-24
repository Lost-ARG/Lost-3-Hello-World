const express = require('express');
const router = express.Router();
const Controller = require('../../controller/game');

router.post('/helloworld', Controller.helloworld)
router.post('/pascal', Controller.pascal)


module.exports = router;
