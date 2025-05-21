const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  time: { type: String, required: true }, // e.g., "2025-05-17T10:00:00Z"
  location: { type: String, required: true },
  participants: { type: Number, default: 1 },
  employeeId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);