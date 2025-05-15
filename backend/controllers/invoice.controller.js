const Invoice = require("../models/Invoice.model");
const PO = require("../models/PO.model");
const mongoose = require("mongoose");

// Create invoice from PO (SUPPLIER or ADMIN)
const createInvoiceFromPO = async (req, res) => {
  try {
    const { poId } = req.params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(poId)) {
      return res.status(400).json({ message: 'Invalid PO ID' });
    }
    
    // Find the PO
    const po = await PO.findById(poId);
    if (!po) {
      return res.status(404).json({ message: "Purchase Order not found" });
    }

    // Only create invoice for approved POs
    if (po.status !== "approved") {
      return res.status(400).json({ 
        message: "Cannot create invoice: Purchase Order is not approved",
        status: po.status
      });
    }

    // Check if invoice already exists for this PO
    const existingInvoice = await Invoice.findOne({ poId });
    if (existingInvoice) {
      return res.status(400).json({ 
        message: "Invoice already exists for this Purchase Order",
        invoice: existingInvoice
      });
    }

    // Generate invoice number
    const invoiceCount = await Invoice.countDocuments();
    const invoiceNumber = `INV-${String(invoiceCount + 1).padStart(5, '0')}`;

    // Calculate invoice totals (if not already in PO)
    const subtotal = po.subtotal || po.services.reduce((sum, service) => sum + service.amount, 0);
    const tax = po.tax || (subtotal * (po.taxRate / 100));
    const total = po.total || (subtotal + tax);

    // Create invoice from PO data
    const newInvoice = new Invoice({
      invoiceNumber,
      poId: po._id,
      quotationId: po.quotationId,
      supplierId: req.user.id, // Current user (supplier) creating the invoice
      clientId: po.clientId,
      date: new Date(), // Current date for invoice creation
      dueDate: req.body.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default: 30 days from now
      
      // Copy billing info from PO
      billTo: po.billTo,
      
      // Copy service details from PO
      services: po.services,
      taxRate: po.taxRate,
      subtotal: subtotal,
      tax: tax,
      total: total,
      
      // Additional data
      poNumber: po.poNumber,
      notes: req.body.notes || po.notes,
      
      // Default status
      status: "pending",
      
      // Optional fields that can be updated from request body
      ...req.body
    });

    const savedInvoice = await newInvoice.save();

    // Update the PO to reference this invoice
    po.invoiceId = savedInvoice._id;
    po.invoiced = true;
    await po.save();

    res.status(201).json({
      message: "Invoice created successfully from Purchase Order",
      invoice: savedInvoice
    });
  } catch (error) {
    console.error("Error creating invoice from PO:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all invoices (ADMIN only)
const getAllInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const invoices = await Invoice.find()
      .populate("poId")
      .populate("quotationId")
      .populate("clientId", "name email companyName")
      .populate("supplierId", "name email companyName")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Invoice.countDocuments();

    res.status(200).json({
      message: "Invoices retrieved successfully",
      invoices,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error("Error fetching all invoices:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get invoices by supplier (SUPPLIER only)
const getInvoicesBySupplier = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const invoices = await Invoice.find({ supplierId: req.user.id })
      .populate("poId")
      .populate("quotationId")
      .populate("clientId", "name email companyName")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Invoice.countDocuments({ supplierId: req.user.id });

    res.status(200).json({
      message: "Supplier invoices retrieved successfully",
      invoices,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error("Error fetching supplier invoices:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get invoices for client (CLIENT only - for invoices related to approved POs)
const getClientInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter for invoices
    const invoiceFilter = { clientId: req.user.id };
    if (status) {
      invoiceFilter.status = status;
    }

    // Fetch invoices and join with POs to ensure PO status is "approved"
    const invoices = await Invoice.aggregate([
      { $match: invoiceFilter },
      {
        $lookup: {
          from: "pos", // MongoDB collection name for PO model
          localField: "poId",
          foreignField: "_id",
          as: "po",
        },
      },
      { $unwind: "$po" }, // Unwind the PO array
      { $match: { "po.status": "approved" } }, // Only include invoices where PO is approved
      {
        $lookup: {
          from: "quotations",
          localField: "quotationId",
          foreignField: "_id",
          as: "quotation",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "clientId",
          foreignField: "_id",
          as: "client",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "supplierId",
          foreignField: "_id",
          as: "supplier",
        },
      },
      { $unwind: { path: "$quotation", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$supplier", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          invoiceNumber: 1,
          poId: 1,
          quotationId: 1,
          supplierId: 1,
          clientId: 1,
          date: 1,
          dueDate: 1,
          billTo: 1,
          services: 1,
          taxRate: 1,
          subtotal: 1,
          tax: 1,
          total: 1,
          poNumber: 1,
          notes: 1,
          status: 1,
          createdAt: 1,
          po: {
            poNumber: 1,
            status: 1,
            createdAt: 1,
          },
          quotation: {
            poNumber: 1,
            total: 1,
            status: 1,
          },
          client: {
            name: 1,
            email: 1,
            companyName: 1,
          },
          supplier: {
            name: 1,
            email: 1,
            companyName: 1,
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);

    // Count total invoices for pagination
    const totalResult = await Invoice.aggregate([
      { $match: invoiceFilter },
      {
        $lookup: {
          from: "pos",
          localField: "poId",
          foreignField: "_id",
          as: "po",
        },
      },
      { $unwind: "$po" },
      { $match: { "po.status": "approved" } },
      { $count: "total" },
    ]);

    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    res.status(200).json({
      message: "Client invoices for approved POs retrieved successfully",
      invoices,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error("Error fetching client invoices for approved POs:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get invoice by ID (with proper access control)
const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Invoice ID' });
    }
    
    const invoice = await Invoice.findById(id)
      .populate("poId")
      .populate("quotationId")
      .populate("clientId", "name email companyName")
      .populate("supplierId", "name email companyName");
    
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    
    // Check if user has access to this invoice
    if (
      req.user.role === "admin" || 
      (invoice.supplierId && invoice.supplierId._id.toString() === req.user.id) || 
      (invoice.clientId && invoice.clientId._id.toString() === req.user.id)
    ) {
      // Verify PO is approved
      if (invoice.poId && invoice.poId.status !== "approved") {
        return res.status(403).json({ message: "Invoice is not associated with an approved PO" });
      }
      return res.status(200).json({
        message: "Invoice retrieved successfully",
        invoice
      });
    } else {
      return res.status(403).json({ message: "Unauthorized to access this invoice" });
    }
  } catch (error) {
    console.error("Error fetching invoice by ID:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update invoice status (CLIENT for payment status, SUPPLIER for other updates)
const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Invoice ID' });
    }
    
    const invoice = await Invoice.findById(id).populate("poId");
    
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    
    // Verify PO is approved
    if (invoice.poId && invoice.poId.status !== "approved") {
      return res.status(403).json({ message: "Invoice is not associated with an approved PO" });
    }
    
    // Check permission based on role
    if (req.user.role === "client") {
      if (invoice.clientId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to update this invoice" });
      }
      
      // Client can only update payment status and notes
      const { status, notes } = req.body;
      
      if (status) {
        if (!["pending", "partially_paid", "paid", "overdue"].includes(status)) {
          return res.status(400).json({ message: "Invalid status" });
        }
        invoice.status = status;
      }
      
      if (notes) {
        invoice.notes = notes;
      }
    } 
    // Supplier can update their own invoice details except payment status
    else if (req.user.role === "supplier" && invoice.supplierId.toString() === req.user.id) {
      const { dueDate, notes } = req.body;
      if (dueDate) invoice.dueDate = dueDate;
      if (notes) invoice.notes = notes;
      // Don't allow supplier to update payment status
    }
    // Admin can update everything
    else if (req.user.role === "admin") {
      Object.keys(req.body).forEach(key => {
        invoice[key] = req.body[key];
      });
    } else {
      return res.status(403).json({ message: "Not authorized to update this invoice" });
    }
    
    const updatedInvoice = await invoice.save();
    res.status(200).json({ 
      message: "Invoice updated successfully", 
      invoice: updatedInvoice 
    });
  } catch (error) {
    console.error("Error updating invoice:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete invoice (ADMIN only)
const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Invoice ID' });
    }
    
    // Only admin can delete invoices
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete invoices" });
    }
    
    const invoice = await Invoice.findById(id).populate("poId");
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    
    // Verify PO is approved
    if (invoice.poId && invoice.poId.status !== "approved") {
      return res.status(403).json({ message: "Invoice is not associated with an approved PO" });
    }
    
    // Find and update associated PO
    if (invoice.poId) {
      const po = await PO.findById(invoice.poId);
      if (po) {
        po.invoiced = false;
        po.invoiceId = null;
        await po.save();
      }
    }
    
    await Invoice.findByIdAndDelete(id);
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createInvoiceFromPO,
  getAllInvoices,
  getInvoicesBySupplier,
  getClientInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};