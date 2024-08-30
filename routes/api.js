var express = require('express');
var router = express.Router();
const Controller = require('../controller/api')


router.post('/signUp', Controller.signUp)

module.exports = router;
