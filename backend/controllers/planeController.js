const Plane = require('../models/Plane');
const { name } = require("express/lib/view");

exports.getPlanes = async (req, res) => {
  try {
    const name = req.query.name
    const isAvailable = req.query.available
    if (name && isAvailable) {
      const planes = await Plane.find({ name: { $regex: name, $options: 'i' } });
      return res.status(200).json(planes);
    } else if (name) {
      console.error(name + ' is not available');
    }
    console.log('Planes fetched successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

