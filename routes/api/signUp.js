const express = require('express');
const router = express.Router();
const Controller = require('../../controller/signUp');

router.post('/', Controller.signUp);
router.get('/verify-email/:email/:emailHash', Controller.verifyEmail);


module.exports = router;
