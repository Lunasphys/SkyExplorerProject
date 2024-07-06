const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['course', 'leisure'], required: true },
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  professor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  day: { type: String, required: true },
  hour: { type: String, required: true },
  duration: { type: Number, required: true },
  plane : { type: Schema.Types.ObjectId, ref: 'Plane', required: true },
});

module.exports = mongoose.model('Event', EventSchema);
