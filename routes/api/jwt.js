const express = require('express');
const router = express.Router();
const Controller = require('../../controller/jwt');

router.get('/generate', Controller.getToken);
router.post('/verify', Controller.verifyToken);


module.exports = router;
