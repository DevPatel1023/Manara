const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  description: { type: String, required: true },
  hours: { type: Number, default: 0 },
  ratePerHour: { type: Number, default: 0 },
  amount: { type: Number, default: 0 },
});

const quotationSchema = new mongoose.Schema({
  rfqId: { type: mongoose.Schema.Types.ObjectId, ref: "RFQ", required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Company Information
  companyName: String,
  address: String,
  cityState: String,
  postalCode: String,
  email: String,

  // Bill To
  billToCompany: String,
  billToAddress: String,
  billToCityState: String,
  billToPostalCode: String,

  // Quotation Details
  poNumber: String,
  date: String,
  deliveryDate: String,
  services: [serviceSchema],
  taxRate: { type: Number, default: 0 },
  notes: String,
  paymentTerms: String,
  paymentMode: String,
  completionDate: String,
  customPaymentTerms: String,

  // Status
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quotation", quotationSchema);
