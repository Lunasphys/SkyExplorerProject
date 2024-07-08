const Event = require('../models/Event');
const User = require('../models/User');
const Plane = require('../models/Plane');

exports.createEvent = async (req, res) => {
  const { title, type, studentId, professorId, day, hour, duration, planeId } = req.body;

  if (!title || !type || !studentId || !professorId || !day || !hour || !duration || !planeId) {
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

    const plane = await Plane.findById(planeId);
    if (!plane) {
      return res.status(400).json({ message: 'Invalid plane ID.' });
    }

    const event = new Event({ title, type, student: studentId, professor: professorId, day, hour, duration, plane: planeId });
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
      events = await Event.find().populate('student').populate('professor').populate('plane');
    } else if (role === 'professor') {
      events = await Event.find({ professor: _id }).populate('student').populate('professor').populate('plane');
    } else if (role === 'student') {
      events = await Event.find({ student: _id }).populate('student').populate('professor').populate('plane');
    }

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events.', error });
  }
};

exports.getEventsByProfessor = async (req, res) => {
  try {
    const professorId = req.params.professorId;
    const events = await Event.find({ professor: professorId }).populate('student').populate('professor').populate('plane');
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events.', error });
  }
};

exports.getEventsByType = async (req, res) => {
  try {
    const { type } = req.params;
    console.log(`Fetching events of type: ${type}`);

    const events = await Event.find({ type: type }).populate('student').populate('professor').populate('plane');
    console.log(`Found ${events.length} events of type ${type}`);

    res.json(events);
  } catch (error) {
    console.error("Error fetching events by type:", error);
    res.status(500).send("Error fetching events by type");
  }
};

exports.getAvailablePlanes = async (req, res) => {
  try {
    const { day, hour, duration } = req.query;

    if (!day || !hour || !duration) {
      return res.status(400).json({ message: 'day, hour, and duration are required' });
    }

    const planes = await Plane.find();
    const eventsOnDate = await Event.find({ day });

    const availablePlanes = planes.filter(plane => {
      const planeEvents = eventsOnDate.filter(event => event.plane.toString() === plane._id.toString());
      return !planeEvents.some(event => {
        const eventStartTime = new Date(`${day}T${event.hour}`);
        const eventEndTime = new Date(eventStartTime.getTime() + event.duration * 60 * 60 * 1000);
        const queryStartTime = new Date(`${day}T${hour}`);
        const queryEndTime = new Date(queryStartTime.getTime() + duration * 60 * 60 * 1000);
        return (queryStartTime < eventEndTime && queryEndTime > eventStartTime);
      });
    });
    res.status(200).json(availablePlanes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const { title, type, studentId, professorId, day, hour, duration, planeId } = req.body;

  if (!title || !type || !studentId || !professorId || !day || !hour || !duration || !planeId) {
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

    const plane = await Plane.findById(planeId);
    if (!plane) {
      return res.status(400).json({ message: 'Invalid plane ID.' });
    }

    const event = await Event.findByIdAndUpdate(eventId, {
      title,
      type,
      student: studentId,
      professor: professorId,
      day,
      hour,
      duration,
      plane: planeId
    }, { new: true });

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event.', error });
  }
};

exports.deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  console.log('Deleting event with ID:', eventId);

  try {
    const event = await Event.findByIdAndDelete(eventId);

    if (!event) {
      console.log('Event not found');
      return res.status(404).json({ message: 'Event not found.' });
    }

    res.status(200).json({ message: 'Event deleted successfully.' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event.', error });
  }
};




