const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const eventController = require('../controllers/eventController');
const planeController = require('../controllers/planeController');
const authMiddleware = require('../middleware/authMiddleware');

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/createAccount', authController.createAccount);

// Event routes
router.get('/events', authMiddleware(), eventController.getEvents);
router.post('/events', authMiddleware(['professor', 'admin']), eventController.createEvent);
router.get('/events/availablePlanes', authMiddleware(['admin', 'professor']), eventController.getAvailablePlanes);

// User routes
router.get('/users', authMiddleware(['admin', 'professor']), authController.getUsers);
router.get('/user', authMiddleware(), authController.getUser);
router.get('/students', authMiddleware(['admin', 'professor']), authController.getStudents);
router.get('/professors', authMiddleware(['admin', 'professor']), authController.getProfessors);

// Plane routes
router.get('/planes', authMiddleware(['admin', 'professor']), planeController.getPlanes);

module.exports = router;
