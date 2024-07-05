const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware(['admin', 'professor']), eventController.createEvent);
router.get('/', authMiddleware(), eventController.getEvents);

module.exports = router;
