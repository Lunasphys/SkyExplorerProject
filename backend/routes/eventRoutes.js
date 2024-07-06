const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/events', authMiddleware(), eventController.getEvents);
router.post('/events', authMiddleware(['admin', 'professor']), eventController.createEvent);
router.get('/events/availablePlanes', authMiddleware(['admin', 'professor']), eventController.getAvailablePlanes);

module.exports = router;


module.exports = router;
