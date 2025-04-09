const mongoose = require("mongoose");

const QuotationSchema = new mongoose.Schema({
  companyName: { type: String },
  address: { type: String },
  cityState: { type: String },
  postalCode: { type: String },
  email: { type: String },
  customPaymentTerms: { type: String },

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

  rfqId: { type: mongoose.Schema.Types.ObjectId, ref: "RFQ", required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
});

module.exports = mongoose.model("Quotation", QuotationSchema);
