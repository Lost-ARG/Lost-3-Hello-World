const express = require('express');
const router = express.Router();
const Controller = require('../../controller/team');

router.post('/update-progress', Controller.updateProgress);


module.exports = router;
