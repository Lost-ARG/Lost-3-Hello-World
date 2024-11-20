const express = require('express');
const router = express.Router();
const Controller = require('../../controller/statistic');
const { adminLoginCheck } = require('../../middleware/loginCheck');

router.get('/teams', adminLoginCheck, Controller.teams)


module.exports = router;
