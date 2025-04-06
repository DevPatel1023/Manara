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