const Invoice = require("../models/Invoice.model");

// ✅ Create an Invoice (Only Admins)
const createInvoice = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Access denied. Only admins can create invoices." });
    }

    const { client, items, dueDate } = req.body;
    
    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newInvoice = await Invoice.create({
      client,
      items,
      totalAmount,
      dueDate,
      createdBy: req.user.id,
    });

    res.status(201).json({ msg: "Invoice created successfully", invoice: newInvoice });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// ✅ Get All Invoices (Admins Only)
const getAllInvoices = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Access denied. Only admins can view all invoices." });
    }

    const invoices = await Invoice.find().populate("client", "firstName lastName email");
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// ✅ Get Invoices for Logged-in Client
const getClientInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ client: req.user.id });
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// ✅ Update Invoice Status (Admins Only)
const updateInvoice = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Access denied. Only admins can update invoices." });
    }

    const { id } = req.params;
    const { status } = req.body;

    const updatedInvoice = await Invoice.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedInvoice) return res.status(404).json({ msg: "Invoice not found" });

    res.status(200).json({ msg: "Invoice updated", invoice: updatedInvoice });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// ✅ Delete Invoice (Admins Only)
const deleteInvoice = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Access denied. Only admins can delete invoices." });
    }

    const { id } = req.params;
    const deletedInvoice = await Invoice.findByIdAndDelete(id);
    if (!deletedInvoice) return res.status(404).json({ msg: "Invoice not found" });

    res.status(200).json({ msg: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = {
  createInvoice,
  getAllInvoices,
  getClientInvoices,
  updateInvoice,
  deleteInvoice,
};
