const express = require('express');
const router = express.Router();
const Controller = require('../../controller/story');
require('dotenv').config()

router.get('/', Controller.getStory);


module.exports = router;
