const POSchema = new mongoose.Schema({
    quotationId: { type: mongoose.Schema.Types.ObjectId, ref: "Quotation", required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("PO", POSchema);
  