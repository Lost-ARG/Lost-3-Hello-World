const express = require('express');
const router = express.Router();
const Controller = require('../../controller/signUp');

router.post('/', Controller.signUp);


module.exports = router;
