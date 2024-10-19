const express = require('express');
const router = express.Router();
const Controller = require('../../controller/player');
require('dotenv').config()

router.post('/login', Controller.login);
router.get('/team', Controller.team);
router.get('/logout', Controller.logout);


module.exports = router;
