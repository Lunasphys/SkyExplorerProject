const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware(), eventController.getEvents);
router.post('/events', authMiddleware(['admin', 'professor']), eventController.createEvent);


module.exports = router;
