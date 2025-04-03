const mongoose = require("mongoose");

const RFQSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("RFQ", RFQSchema);
