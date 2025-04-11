const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  description: { type: String, required: true, trim: true },
  hours: { type: Number, required: true, min: [0, 'Hours must be greater than or equal to 0'] },
  ratePerHour: { type: Number, required: true, min: [0, 'Rate per hour must be greater than or equal to 0'] },
  amount: { type: Number, required: true, min: [0, 'Amount must be greater than or equal to 0'] },
});

const POSchema = new mongoose.Schema({
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Client ID is required'] 
  },
  quotationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Quotation', 
    required: [true, 'Quotation ID is required'] 
  },
  poNumber: { 
    type: String, 
    required: [true, 'PO number is required'], 
    unique: true, 
    trim: true 
  },
  date: { 
    type: Date, 
    required: [true, 'Date is required'] 
  },
  deliveryDate: { 
    type: Date, 
    required: [true, 'Delivery date is required'] 
  },
  billTo: {
    company: { type: String, required: [true, 'Company name is required'], trim: true },
    address: { type: String, required: [true, 'Address is required'], trim: true },
    cityState: { type: String, required: [true, 'City/State is required'], trim: true },
    postalCode: { type: String, required: [true, 'Postal code is required'], trim: true },
    phone: { type: String, required: [true, 'Phone number is required'], trim: true },
    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      trim: true, 
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'] 
    },
  },
  services: {
    type: [ServiceSchema],
    required: [true, 'At least one service is required'],
    validate: [array => array.length > 0, 'At least one service is required'],
  },
  taxRate: { 
    type: Number, 
    required: [true, 'Tax rate is required'], 
    min: [0, 'Tax rate cannot be negative'], 
    default: 0 
  },
  subtotal: { 
    type: Number, 
    min: [0, 'Subtotal must be greater than or equal to 0'] // Removed required
  },
  tax: { 
    type: Number, 
    min: [0, 'Tax must be greater than or equal to 0'] // Removed required
  },
  total: { 
    type: Number, 
    min: [0, 'Total must be greater than or equal to 0'] // Removed required
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  notes: { 
    type: String, 
    trim: true, 
    default: '' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

// Pre-save hook to calculate subtotal, tax, and total
POSchema.pre('save', function (next) {
  this.subtotal = this.services.reduce((sum, service) => sum + service.amount, 0);
  this.tax = (this.subtotal * this.taxRate) / 100;
  this.total = this.subtotal + this.tax;
  next();
});

// Pre-validate hook to ensure deliveryDate >= date
POSchema.pre('validate', function (next) {
  if (this.deliveryDate < this.date) {
    return next(new Error('Delivery date cannot be before PO date'));
  }
  next();
});

module.exports = mongoose.model('PO', POSchema);