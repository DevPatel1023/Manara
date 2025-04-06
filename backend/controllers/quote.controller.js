const Quotation = require("../models/Quotation.model");

// Create a new quotation
const createQuotation = async (req, res) => {
  try {
    const {
      rfqId,
      supplierId,
      companyName,
      address,
      cityState,
      postalCode,
      email,
      billToCompany,
      billToAddress,
      billToCityState,
      billToPostalCode,
      poNumber,
      date,
      deliveryDate,
      services,
      taxRate,
      notes,
      paymentTerms,
      paymentMode,
      completionDate,
      customPaymentTerms,
    } = req.body;

    if (!rfqId || !supplierId || !services || services.length === 0) {
      return res.status(400).json({ msg: "Required fields missing" });
    }

    const quotation = await Quotation.create({
      rfqId,
      supplierId,
      companyName,
      address,
      cityState,
      postalCode,
      email,
      billToCompany,
      billToAddress,
      billToCityState,
      billToPostalCode,
      poNumber,
      date,
      deliveryDate,
      services,
      taxRate,
      notes,
      paymentTerms,
      paymentMode,
      completionDate,
      customPaymentTerms,
    });

    res.status(201).json({ msg: "Quotation created successfully", quotation });
  } catch (error) {
    console.error("Error creating quotation:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get all quotations (for admin)
const getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find().populate("rfqId").populate("supplierId");
    res.status(200).json(quotations);
  } catch (error) {
    console.error("Error fetching quotations:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get quotations by supplier (employee view)
const getQuotationsBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const quotations = await Quotation.find({ supplierId }).populate("rfqId");
    res.status(200).json(quotations);
  } catch (error) {
    console.error("Error fetching supplier quotations:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get quotations by RFQ (admin or employee)
const getQuotationsByRFQ = async (req, res) => {
  try {
    const { rfqId } = req.params;
    const quotations = await Quotation.find({ rfqId }).populate("supplierId");
    res.status(200).json(quotations);
  } catch (error) {
    console.error("Error fetching RFQ quotations:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Update quotation status (accept/reject)
const updateQuotationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const updatedQuotation = await Quotation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedQuotation) {
      return res.status(404).json({ msg: "Quotation not found" });
    }

    res.status(200).json({ msg: "Status updated", quotation: updatedQuotation });
  } catch (error) {
    console.error("Error updating quotation status:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Delete a quotation (optional)
const deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Quotation.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ msg: "Quotation not found" });
    }

    res.status(200).json({ msg: "Quotation deleted" });
  } catch (error) {
    console.error("Error deleting quotation:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = {
  createQuotation,
  getAllQuotations,
  getQuotationsBySupplier,
  getQuotationsByRFQ,
  updateQuotationStatus,
  deleteQuotation,
};
