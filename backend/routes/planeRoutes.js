const express = require('express');
const router = express.Router();
const planeController = require('../controllers/planeController');


router.get('/planes', planeController.getPlanes);


module.exports = router;