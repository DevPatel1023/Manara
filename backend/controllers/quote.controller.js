const Quotation = require("../models/Quotation.model");
const RFQ = require("../models/RFQ.model"); // To check client ownership of RFQ

// 🔨 Create a new quotation (EMPLOYEE)
const createQuotation = async (req, res) => {
  try {
    const {
      rfqId,
      poNumber,
      date,
      deliveryDate,
      billToCompany,
      billToAddress,
      billToCityState,
      billToPostalCode,
      services,
      taxRate,
      subtotal,
      tax,
      total,
      paymentTerms,
      notes,
      companyName,
      address,
      cityState,
      postalCode,
      email,
      customPaymentTerms,
    } = req.body;

    // Validation
    if (
      !rfqId ||
      !poNumber ||
      !date ||
      !deliveryDate ||
      !billToCompany ||
      !billToAddress ||
      !billToCityState ||
      !billToPostalCode ||
      !services ||
      services.length === 0 ||
      taxRate === undefined ||
      subtotal === undefined ||
      tax === undefined ||
      total === undefined ||
      !paymentTerms
    ) {
      return res.status(400).json({ msg: "Please fill in all required fields" });
    }

    const newQuotation = new Quotation({
      rfqId,
      supplierId: req.user.id,
      poNumber,
      date,
      deliveryDate,
      billToCompany,
      billToAddress,
      billToCityState,
      billToPostalCode,
      services,
      taxRate: Number(taxRate),
      subtotal,
      tax,
      total,
      paymentTerms,
      notes,
    
      // ✅ Add these
      companyName,
      address,
      cityState,
      postalCode,
      email,
      customPaymentTerms,
    });
    
    const savedQuotation = await newQuotation.save();

    res.status(201).json({
      msg: "Quotation created successfully",
      quotation: savedQuotation,
    });
  } catch (error) {
    console.error("Error creating quotation:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// 📋 Get all quotations (ADMIN only)
const getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find()
      .populate("rfqId")
      .populate("supplierId");
    res.status(200).json(quotations);
  } catch (error) {
    console.error("Error fetching quotations:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// 👤 Get quotations by supplier (EMPLOYEE only)
const getQuotationsBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;

    // Ensure only employee views their own quotations
    if (req.user.id !== supplierId) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const quotations = await Quotation.find({ supplierId }).populate("rfqId");
    res.status(200).json(quotations);
  } catch (error) {
    console.error("Error fetching supplier quotations:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// 🧾 Get quotations by RFQ (CLIENT only for their RFQs)
// 🧾 Get quotations for a specific RFQ (CLIENT only if they created it)
const getQuotationsByRFQ = async (req, res) => {
  try {
    const { rfqId } = req.params;

    // Check if the RFQ belongs to this client
    const rfq = await RFQ.findOne({ _id: rfqId, clientId: req.user.id });
    if (!rfq) {
      return res.status(403).json({ msg: "Unauthorized: RFQ not found or not owned by you" });
    }

    const quotations = await Quotation.find({ rfqId })
      .populate("supplierId")
      .populate("rfqId");

    res.status(200).json(quotations);
  } catch (error) {
    console.error("Error fetching quotations by RFQ:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
// 📦 Client gets all quotations for their RFQs
const getAllQuotationsForClient = async (req, res) => {
  try {
    // 1. Find all RFQs created by this client
    const rfqs = await RFQ.find({ clientId: req.user.id }).select("_id");

    const rfqIds = rfqs.map((rfq) => rfq._id);

    // 2. Find quotations where rfqId is one of those RFQs
    const quotations = await Quotation.find({ rfqId: { $in: rfqIds } })
      .populate("rfqId")
      .populate("supplierId");

    res.status(200).json(quotations);
  } catch (error) {
    console.error("Error fetching client quotations:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// ✅ Update quotation status (CLIENT only for RFQs they created)
const updateQuotationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const quotation = await Quotation.findById(id).populate("rfqId");
    if (!quotation) {
      return res.status(404).json({ msg: "Quotation not found" });
    }

    // Check client owns the RFQ tied to this quotation
    if (quotation.rfqId.clientId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized to update status" });
    }

    quotation.status = status;
    await quotation.save();

    res.status(200).json({ msg: "Status updated", quotation });
  } catch (error) {
    console.error("Error updating quotation status:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// ❌ Delete a quotation (ADMIN only)
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
  getAllQuotationsForClient
};
