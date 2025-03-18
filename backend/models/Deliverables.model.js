const DeliverableSchema = new mongoose.Schema({
    poId: { type: mongoose.Schema.Types.ObjectId, ref: "PO", required: true },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["submitted", "approved", "revision requested"], default: "submitted" },
    comments: { type: String },
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("Deliverable", DeliverableSchema);
  