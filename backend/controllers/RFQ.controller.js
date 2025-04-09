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
            additionalNotes,
            clientId: req.user.id
        });

        await newRFQ.save();
        return res.status(200).json({ msg: "RFQ created successfully", rfq: newRFQ });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

// 2. Get RFQs submitted by a client
const getClientRFQS = async (req, res) => {
  try {
    const clientId = req.user.id;

    const clientRfqs = await RFQ.find({ clientId }).sort({ createdAt: -1 });

    return res.status(200).json({ rfqs: clientRfqs });
  } catch (error) {
    console.error("Error fetching client RFQs:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// 3. Get all RFQs (Admin only)
const getAllRFQs = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Forbidden: Only admins can access all RFQs" });
    }

    const rfqs = await RFQ.find().sort({ createdAt: -1 }).populate("clientId employeeId");

    return res.status(200).json({ rfqs });
  } catch (error) {
    console.error("Error fetching all RFQs:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// 4. Update RFQ Status (Admin only)
const updateStatusRFQ = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Only admins can update RFQ status" });
    }

    const { id, status, employeeId } = req.body;

    if (!id || !["accepted", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status or RFQ ID" });
    }

    const updateFields = { status };
    if (status === "accepted" && employeeId) {
      updateFields.employeeId = employeeId; // ✅ matches your schema field
    }

    const updatedRFQ = await RFQ.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).populate("clientId employeeId");

    if (!updatedRFQ) {
      return res.status(404).json({ msg: "RFQ not found" });
    }

    return res.status(200).json({ msg: `RFQ ${status} successfully`, rfq: updatedRFQ });
  } catch (error) {
    console.error("Error updating RFQ status:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// 5. Get RFQs assigned to an employee
const getAssignedRFQsForEmployee = async (req, res) => {
  try {
    if (req.user.role !== "employee") {
      return res.status(403).json({ msg: "Only employees can access assigned RFQs" });
    }

    const rfqs = await RFQ.find({
      status: "accepted",
      employeeId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({ rfqs });
  } catch (error) {
    console.error("Error getting assigned RFQs:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  createRFQ,
  getClientRFQS,
  getAllRFQs,
  updateStatusRFQ,
  getAssignedRFQsForEmployee,
};