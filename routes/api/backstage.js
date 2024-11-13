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
router.get('/payment-search', adminLoginCheck, Controller.paymentSearch);
router.post('/change-paid-stat', adminLoginCheck, Controller.changePaidStat);
router.get('/search-team-by-paid', adminLoginCheck, Controller.searchTeamByPaid);
router.get('/notice-list', Controller.noticeList);
router.get('/notice', Controller.notice);
router.post('/create-notice', Controller.createNotice);
router.post('/update-notice', Controller._updateNotice);


module.exports = router;
