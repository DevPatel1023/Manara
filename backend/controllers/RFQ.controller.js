const RFQ = require("../models/RFQ.model.js");

// 1. Create RFQ
const createRFQ = async (req, res) => {
    try {
        const {
            companyName,
            name,
            email,
            phoneNumber,
            serviceRequired,
            projectDescription,
            file,
            estimatedBudget,
            deadline,
            additionalNotes
        } = req.body;

        if (!companyName || !name || !email || !phoneNumber || !serviceRequired || !projectDescription || !deadline) {
            return res.status(400).json({ msg: "Required fields missing" });
        }

        const newRFQ = new RFQ({
            companyName,
            name,
            email,
            phoneNumber,
            serviceRequired,
            projectDescription,
            file,
            estimatedBudget,
            deadline,
            additionalNotes
        });

        await newRFQ.save();
        return res.status(200).json({ msg: "RFQ created successfully", rfq: newRFQ });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

// 2. Get RFQs Submitted by a Client (based on email match)
const getClientRFQS = async (req, res) => {
    try {
      const clientId = req.user._id; // assuming this is populated from auth middleware
      const clientRfqs = await RFQ.find({ clientId });
  
      return res.status(200).json({ rfqs: clientRfqs });
    } catch (error) {
      console.error("Error fetching client RFQs:", error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };
  

// 3. Get All RFQs (Admin)
// controllers/RFQ.controller.js
const getAllRFQs = async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Forbidden: only admins can access all RFQs" });
      }
  
      const rfqs = await RFQ.find({}).sort({ createdAt: -1 });
  
      return res.status(200).json({ rfqs }); // ✅ wrap inside object
    } catch (error) {
      console.error("Error fetching RFQs:", error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };
  
// 4. Update RFQ Status (Admin)
const updateStatusRFQ = async (req, res) => {
    try {
      console.log("Request body:", req.body); 
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Forbidden: only admins can update the RFQ status" });
        }

        const { id, status } = req.body;
        if (!id || !["accepted", "rejected", "pending"].includes(status)) {
            return res.status(400).json({ msg: "Invalid Request" });
        }

        const updatedRFQ = await RFQ.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedRFQ) {
            return res.status(404).json({ msg: "RFQ not found" });
        }

        return res.status(200).json({ msg: `RFQ ${status} successfully`, updatedRFQ });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

const getAcceptedRFQs = async (req, res) => {
  try {
    if(req.user.role !== "employee"){
      return res.status(403).json({
        msg : "Forbidden: only Employees can access all accepted RFQs"
      })
    }

    const rfqs = await RFQ.find({ status: "accepted" });
    res.status(200).json({rfqs});
  } catch (err) {
    console.error("Error getting assigned RFQs:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { createRFQ, getClientRFQS, getAllRFQs, updateStatusRFQ,getAcceptedRFQs };
