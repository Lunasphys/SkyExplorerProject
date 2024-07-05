const Event = require('../models/Event');
const User = require('../models/User');

exports.createEvent = async (req, res) => {
  const { title, type, studentId, professorId, day, hour, duration } = req.body;
  if (!title || !type || !studentId || !professorId || !day || !hour || !duration) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(400).json({ message: 'Invalid student ID.' });
    }

    const professor = await User.findById(professorId);
    if (!professor || professor.role !== 'professor') {
      return res.status(400).json({ message: 'Invalid professor ID.' });
    }

    const event = new Event({ title, type, student: studentId, professor: professorId, day, hour, duration });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
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

