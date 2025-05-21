const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, required: true },
  status: { type: String, enum: ['active', 'pending'], default: 'pending' },
  clientId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Client' }, // Links to PO client
  employeeId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);