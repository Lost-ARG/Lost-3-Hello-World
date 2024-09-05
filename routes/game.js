const express = require('express');
const router = express.Router();
const Controller = require('../controller/game');

router.post('/helloworld', Controller.helloworld)


module.exports = router;
