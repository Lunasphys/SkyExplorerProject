const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaneSchema = new Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  available: { type: Boolean, required: true },
});

module.exports = mongoose.model('Plane', PlaneSchema);