const PaymentSchema = new mongoose.Schema({
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["processing", "completed"], default: "processing" },
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("Payment", PaymentSchema);
  