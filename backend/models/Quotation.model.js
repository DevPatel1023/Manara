// const mongoose = require("mongoose");

// const serviceSchema = new mongoose.Schema({
//   description: { type: String, required: true },
//   hours: { type: Number, default: 0 },
//   ratePerHour: { type: Number, default: 0 },
//   amount: { type: Number, default: 0 },
// });

// const quotationSchema = new mongoose.Schema({
//   rfqId: { type: mongoose.Schema.Types.ObjectId, ref: "RFQ", required: true },
//   supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

//   // Company Information
//   companyName: String,
//   address: String,
//   cityState: String,
//   postalCode: String,
//   email: String,

//   // Bill To
//   billToCompany: String,
//   billToAddress: String,
//   billToCityState: String,
//   billToPostalCode: String,

//   // Quotation Details
//   poNumber: String,
//   date: String,
//   deliveryDate: String,
//   services: [serviceSchema],
//   taxRate: { type: Number, default: 0 },
//   notes: String,
//   paymentTerms: String,
//   paymentMode: String,
//   completionDate: String,
//   customPaymentTerms: String,

//   // Status
//   status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },

//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Quotation", quotationSchema);
const mongoose = require("mongoose");

const QuotationSchema = new mongoose.Schema({
  poNumber: { type: String, required: true },
  date: { type: Date, required: true },
  deliveryDate: { type: Date, required: true },
  billToCompany: { type: String, required: true },
  billToAddress: { type: String, required: true },
  billToCityState: { type: String, required: true },
  billToPostalCode: { type: String, required: true },
  services: [
    {
      name: String,
      quantity: Number,
      unitPrice: Number,
      total: Number,
    },
  ],
  taxRate: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentTerms: { type: String, required: true },
  notes: { type: String },
  // completionDate: { type: Date, required: false },

});

module.exports = mongoose.model("Quotation", QuotationSchema);

