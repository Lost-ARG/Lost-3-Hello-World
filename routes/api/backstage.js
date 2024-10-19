const express = require('express');
const router = express.Router();
const Controller = require('../../controller/backstage');
const { adminLoginCheck } = require('../../middleware/loginCheck');
require('dotenv').config()

router.post('/login', Controller.login);
router.get('/logout', adminLoginCheck, Controller.logout);
router.get('/team-list', adminLoginCheck, Controller.teamList);
router.get('/team', adminLoginCheck, Controller.team);
router.post('/register-rfid', adminLoginCheck, Controller.registerRFID);
router.get('/rfid-list', adminLoginCheck, Controller.RFIDList);


module.exports = router;
