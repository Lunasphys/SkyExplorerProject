const Event = require('../models/Event');
const User = require('../models/User');

exports.getStatistics = async (req, res) => {
  try {
    const totalFlightTime = await Event.aggregate([
      { $group: { _id: null, totalDuration: { $sum: "$duration" } } }
    ]);

    const totalLessons = await Event.find({type: type}).countDocuments();
    const totalLeisure = await Event.find({type: "leisure"}).countDocuments();

    const totalStudents = await User.find({role: "student"}).countDocuments();

    res.status(200).json({
      totalFlightTime: totalFlightTime[0]?.totalDuration || 0,
      totalLessons,
      totalLeisure,
      totalStudents,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error });
  }
};
