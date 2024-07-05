const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/createAccount', authController.createAccount);
router.get('/events', authMiddleware(), eventController.getEvents);
router.post('/events', authMiddleware(['professor', 'admin']), eventController.createEvent);
router.get('/users', authMiddleware(['admin', 'professor']), authController.getUsers);
router.get('/students', authMiddleware(['admin', 'professor']), authController.getStudents);
router.get('/professors', authMiddleware(['admin', 'professor']), authController.getProfessors);

module.exports = router;
