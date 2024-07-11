const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const authController = require("../controllers/authController");
const statisticsController = require('../controllers/statisticController');


router.get('/events', authMiddleware(), eventController.getEvents);
router.post('/events', authMiddleware(['admin', 'professor']), eventController.createEvent);
router.get('/events/availablePlanes', authMiddleware(['admin', 'professor']), eventController.getAvailablePlanes);
router.get('/events/getEventsByProfessor/:professorId', authMiddleware(['admin']), eventController.getEventsByProfessor);
router.get('/events/getEventsByStudent/:studentId', authMiddleware(['admin']), eventController.getEventsByStudent);
router.get('/events', eventController.getEventsByType);
router.get('/professor/:professorId', eventController.getEventsByProfessor);
router.get('/student/:studentId', eventController.getEventsByStudent);
router.get('/events/type/:type', eventController.getEventsByType);


router.put('/events/:eventId', authMiddleware(['admin']), eventController.updateEvent);
router.delete('/events/:eventId', authMiddleware(['admin']), eventController.deleteEvent);

router.get('/statistics', authMiddleware(['admin']), statisticsController.getStatistics);

module.exports = router;
