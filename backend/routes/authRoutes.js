const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const eventController = require('../controllers/eventController');
const planeController = require('../controllers/planeController');
const authMiddleware = require('../middleware/authMiddleware');

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
// Event routes
router.get('/events', authMiddleware(), eventController.getEvents);
router.post('/events', authMiddleware(['professor', 'admin']), eventController.createEvent);
router.get('/events/availablePlanes', authMiddleware(['admin', 'professor']), eventController.getAvailablePlanes);
router.get('/professor/:professorId', eventController.getEventsByProfessor);
router.get('/student/:studentId', eventController.getEventsByStudent);

// User routes
router.get('/users', authMiddleware(['admin', 'professor']), authController.getUsers);
router.get('/user', authMiddleware(), authController.getUser);
router.get('/students', authMiddleware(['admin', 'professor']), authController.getStudents);
router.get('/professors', authMiddleware(['admin', 'professor']), authController.getProfessors);
router.get('/events/type/:type', eventController.getEventsByType);

router.put('/events/:eventId', authMiddleware(['admin']), eventController.updateEvent);
router.delete('/events/:eventId', authMiddleware(['admin']), eventController.deleteEvent);

// Plane routes
router.get('/planes', authMiddleware(['admin', 'professor']), planeController.getPlanes);

module.exports = router;
