const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  time: { type: String, required: true }, // e.g., "2 hours ago"
  employeeId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);