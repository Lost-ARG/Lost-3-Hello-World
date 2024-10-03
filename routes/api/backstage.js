const express = require('express');
const router = express.Router();
const Controller = require('../../controller/backstage');
require('dotenv').config()

router.post('/login', Controller.login);
router.get('/team-list', Controller.teamList);
router.get('/team', Controller.team);
router.post('/register-rfid', Controller.registerRFID);
router.get('/rfid-list', Controller.RFIDList);


module.exports = router;
