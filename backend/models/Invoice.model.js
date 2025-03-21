const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Paid", "Overdue"], default: "Pending" },
  dueDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
