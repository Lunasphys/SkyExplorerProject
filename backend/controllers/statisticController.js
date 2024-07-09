const Event = require('../models/Event');
const User = require('../models/User');

exports.getStatistics = async (req, res) => {
  try {
    const totalFlightTime = await Event.aggregate([
      { $group: { _id: null, totalDuration: { $sum: "$duration" } } }
    ]);

    const totalLessons = await Event.countDocuments({ type: 'course' });

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      totalFlightTime: totalFlightTime[0]?.totalDuration || 0,
      totalLessons,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error });
  }
};
