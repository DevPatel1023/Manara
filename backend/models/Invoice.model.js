const InvoiceSchema = new mongoose.Schema({
    poId: { type: mongoose.Schema.Types.ObjectId, ref: "PO", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("Invoice", InvoiceSchema);
  