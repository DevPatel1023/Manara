const mongoose = require("mongoose");

const RFQSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  serviceRequired: { type: String, required: true },
  projectDescription: { type: String, required: true },
  file: { type: String }, // URL or file path (optional)
  estimatedBudget: { type: Number },
  deadline: { type: Date, required: true },
  additionalNotes: { type: String },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // link to the client user
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming employee is a User
  },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("RFQ", RFQSchema);
