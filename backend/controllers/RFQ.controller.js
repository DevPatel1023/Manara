const RFQ = require("../models/RFQ.model.js");

// 1. Create RFQ
const createRFQ = async (req, res) => {
    try {
        const { title, quantity, description, deadline } = req.body;
        if (!title || !quantity || !description || !deadline) {
            return res.status(400).json({ msg: "All Fields are required" });
        }

        const newRFQ = new RFQ({
            clientId: req.user.id,
            title,
            quantity,
            description,
            deadline
        });

        await newRFQ.save();
        return res.status(200).json({ msg: "RFQ created successfully", rfq: newRFQ });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}

// 2. Get RFQs Submitted by a Client
const getClientRFQS = async (req, res) => {
    try {
        const clientRfqs = await RFQ.find({ clientId: req.user.id });
        return res.status(200).json(clientRfqs); // Return as array
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}

// 3. Get All RFQs for Admin
const getAllRFQs = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Forbidden: only admins can access all RFQs" });
        }

        // Step 1: Get all RFQs
        let rfqs = await RFQ.find({}).populate("clientId", "role firstName lastName email");

        // Step 2: Filter RFQs where clientId role is "client"
        rfqs = rfqs.filter(rfq => rfq.clientId && rfq.clientId.role === "client");

        return res.status(200).json(rfqs);
    } catch (error) {
        console.error("Error fetching RFQs:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};




// 4. Update RFQ Status (Admin)
const updateStatusRFQ = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Forbidden: only admins can update the RFQ status" });
        }

        const { id, status } = req.body;
        if (!id || !["accepted", "rejected"].includes(status)) {
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
}

module.exports = { createRFQ, getClientRFQS, getAllRFQs, updateStatusRFQ };
