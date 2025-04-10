const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  description: { type: String, required: true, trim: true },
  hours: { type: Number, required: true, min: [0, 'Hours must be greater than or equal to 0'] },
  ratePerHour: { type: Number, required: true, min: [0, 'Rate per hour must be greater than or equal to 0'] },
  amount: { type: Number, required: true, min: [0, 'Amount must be greater than or equal to 0'] },
});

const POSchema = new mongoose.Schema({
  quotationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  poNumber: { type: String, required: true, unique: true, trim: true }, // e.g., "PO-1234"
  date: { type: Date, required: true },
  deliveryDate: { type: Date, required: true },
  billTo: {
    company: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    cityState: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
  },
  services: [ServiceSchema], // Array of services
  subtotal: { type: Number, required: true, min: [0, 'Subtotal must be greater than or equal to 0'] },
  taxRate: { type: Number, required: true, min: [0, 'Tax rate cannot be negative'], default: 0 },
  tax: { type: Number, required: true, min: [0, 'Tax must be greater than or equal to 0'] },
  total: { type: Number, required: true, min: [0, 'Total must be greater than or equal to 0'] },
  notes: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

// Pre-save middleware to ensure calculated fields are consistent
POSchema.pre('save', function (next) {
  // Calculate subtotal, tax, and total before saving
  this.subtotal = this.services.reduce((sum, service) => sum + service.amount, 0);
  this.tax = (this.subtotal * this.taxRate) / 100;
  this.total = this.subtotal + this.tax;
  next();
});

module.exports = mongoose.model('PO', POSchema);