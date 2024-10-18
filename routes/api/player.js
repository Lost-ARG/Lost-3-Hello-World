const express = require('express');
const router = express.Router();
const Controller = require('../../controller/player');
require('dotenv').config()

router.post('/login', Controller.login);
router.get('/team', Controller.team);


module.exports = router;
