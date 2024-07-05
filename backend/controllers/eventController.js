const Event = require('../models/Event');
const User = require('../models/User');

exports.createEvent = async (req, res) => {
  const { title, type, studentId, professorId, day, hour, duration } = req.body;

  // Log les données reçues
  console.log('Received data:', { title, type, studentId, professorId, day, hour, duration });

  if (!title) {
    console.error('Title is required');
    return res.status(400).json({ message: 'Title is required.' });
  }

  if (!type) {
    console.error('Type is required');
    return res.status(400).json({ message: 'Type is required.' });
  }

  if (!studentId) {
    console.error('Student ID is required');
    return res.status(400).json({ message: 'Student ID is required.' });
  }

  if (!professorId) {
    console.error('Professor ID is required');
    return res.status(400).json({ message: 'Professor ID is required.' });
  }

  if (!day) {
    console.error('Day is required');
    return res.status(400).json({ message: 'Day is required.' });
  }

  if (!hour) {
    console.error('Hour is required');
    return res.status(400).json({ message: 'Hour is required.' });
  }

  if (!duration) {
    console.error('Duration is required');
    return res.status(400).json({ message: 'Duration is required.' });
  }

  try {
    console.log('Fetching student:', studentId);
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      console.error('Invalid student ID');
      return res.status(400).json({ message: 'Invalid student ID.' });
    }

    console.log('Fetching professor:', professorId);
    const professor = await User.findById(professorId);
    if (!professor || professor.role !== 'professor') {
      console.error('Invalid professor ID');
      return res.status(400).json({ message: 'Invalid professor ID.' });
    }

    const event = new Event({ title, type, student: studentId, professor: professorId, day, hour, duration });
    await event.save();
    console.log('Event created:', event);
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event.', error });
  }
};

exports.getEvents = async (req, res) => {
  const { role, _id } = req.user;

  try {
    let events;
    if (role === 'admin') {
      events = await Event.find().populate('student').populate('professor');
    } else if (role === 'professor') {
      events = await Event.find({ professor: _id }).populate('student').populate('professor');
    } else if (role === 'student') {
      events = await Event.find({ student: _id }).populate('student').populate('professor');
    }

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events.', error });
  }
};

