const PO = require('../models/PO'); // Adjust the path to your PO model
const mongoose = require('mongoose');

// Create a new Purchase Order
exports.createPO = async (req, res) => {
  try {
    const {
      quotationId,
      clientId,
      supplierId,
      poNumber,
      date,
      deliveryDate,
      billTo,
      services,
      taxRate,
      notes,
    } = req.body;

    // Validate required fields
    if (!quotationId || !clientId || !supplierId || !poNumber || !date || !deliveryDate || !billTo || !services) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Ensure services array is valid
    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: 'At least one service is required' });
    }

    // Create new PO instance
    const newPO = new PO({
      quotationId,
      clientId,
      supplierId,
      poNumber: `PO-${poNumber}`, // Prefix as in the form
      date: new Date(date),
      deliveryDate: new Date(deliveryDate),
      billTo,
      services: services.map(service => ({
        description: service.description,
        hours: service.hours,
        ratePerHour: service.ratePerHour,
        amount: service.hours * service.ratePerHour, // Calculate amount
      })),
      taxRate: taxRate || 0,
      notes: notes || '',
    });

    // Save to database (pre-save middleware will calculate subtotal, tax, total)
    const savedPO = await newPO.save();

    res.status(201).json({
      message: 'Purchase Order created successfully',
      po: savedPO,
    });
  } catch (error) {
    console.error('Error creating PO:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all Purchase Orders
exports.getAllPOs = async (req, res) => {
  try {
    const pos = await PO.find()
      .populate('quotationId', 'quotationNumber') // Populate relevant fields
      .populate('clientId', 'name email')
      .populate('supplierId', 'name email');

    res.status(200).json(pos);
  } catch (error) {
    console.error('Error fetching POs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single Purchase Order by ID
exports.getPOById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid PO ID' });
    }

    const po = await PO.findById(id)
      .populate('quotationId', 'quotationNumber')
      .populate('clientId', 'name email')
      .populate('supplierId', 'name email');

    if (!po) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }

    res.status(200).json(po);
  } catch (error) {
    console.error('Error fetching PO:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a Purchase Order
exports.updatePO = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      poNumber,
      date,
      deliveryDate,
      billTo,
      services,
      taxRate,
      notes,
      status,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid PO ID' });
    }

    const po = await PO.findById(id);
    if (!po) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }

    // Update fields
    if (poNumber) po.poNumber = `PO-${poNumber}`;
    if (date) po.date = new Date(date);
    if (deliveryDate) po.deliveryDate = new Date(deliveryDate);
    if (billTo) po.billTo = billTo;
    if (services && Array.isArray(services)) {
      po.services = services.map(service => ({
        description: service.description,
        hours: service.hours,
        ratePerHour: service.ratePerHour,
        amount: service.hours * service.ratePerHour,
      }));
    }
    if (taxRate !== undefined) po.taxRate = taxRate;
    if (notes !== undefined) po.notes = notes;
    if (status) po.status = status;

    const updatedPO = await po.save();

    res.status(200).json({
      message: 'Purchase Order updated successfully',
      po: updatedPO,
    });
  } catch (error) {
    console.error('Error updating PO:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a Purchase Order
exports.deletePO = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid PO ID' });
    }

    const po = await PO.findByIdAndDelete(id);

    if (!po) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }

    res.status(200).json({ message: 'Purchase Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting PO:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve a Purchase Order
exports.approvePO = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid PO ID' });
    }

    const po = await PO.findById(id);
    if (!po) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }

    po.status = 'approved';
    const updatedPO = await po.save();

    res.status(200).json({
      message: 'Purchase Order approved successfully',
      po: updatedPO,
    });
  } catch (error) {
    console.error('Error approving PO:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reject a Purchase Order
exports.rejectPO = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid PO ID' });
    }

    const po = await PO.findById(id);
    if (!po) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }

    po.status = 'rejected';
    const updatedPO = await po.save();

    res.status(200).json({
      message: 'Purchase Order rejected successfully',
      po: updatedPO,
    });
  } catch (error) {
    console.error('Error rejecting PO:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = exports;