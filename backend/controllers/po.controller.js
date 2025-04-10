const PO = require('../models/PO.model');
const mongoose = require('mongoose');

// Create a new Purchase Order
exports.createPO = async (req, res) => {
  try {
    const {
      quotationId,
      poNumber,
      date,
      deliveryDate,
      billTo,
      services,
      taxRate,
      notes,
    } = req.body;

    // Get clientId from authenticated user (assuming req.user is set by auth middleware)
    const clientId = req.user._id;

    if (!quotationId || !clientId || !poNumber || !date || 
        !deliveryDate || !billTo || !services || !billTo.company || 
        !billTo.address || !billTo.cityState || !billTo.postalCode || 
        !billTo.phone || !billTo.email) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: 'At least one service is required' });
    }

    for (const service of services) {
      if (!service.description || !service.hours || !service.ratePerHour) {
        return res.status(400).json({ message: 'All service fields are required' });
      }
    }

    const newPO = new PO({
      quotationId,
      clientId,
      poNumber: `PO-${poNumber}`,
      date: new Date(date),
      deliveryDate: new Date(deliveryDate),
      billTo: {
        company: billTo.company,
        address: billTo.address,
        cityState: billTo.cityState,
        postalCode: billTo.postalCode,
        phone: billTo.phone,
        email: billTo.email
      },
      services: services.map(service => ({
        description: service.description,
        hours: service.hours,
        ratePerHour: service.ratePerHour,
        amount: service.hours * service.ratePerHour
      })),
      taxRate: taxRate || 0,
      notes: notes || '',
    });

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
      .populate('quotationId', 'quotationNumber')
      .populate('clientId', 'name email');

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
      .populate('clientId', 'name email');

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
      quotationId,
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

    // Verify the PO belongs to the logged-in client
    if (po.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this PO' });
    }

    if (quotationId) po.quotationId = quotationId;
    if (poNumber) po.poNumber = `PO-${poNumber}`;
    if (date) po.date = new Date(date);
    if (deliveryDate) po.deliveryDate = new Date(deliveryDate);
    if (billTo) {
      po.billTo = {
        ...po.billTo,
        company: billTo.company || po.billTo.company,
        address: billTo.address || po.billTo.address,
        cityState: billTo.cityState || po.billTo.cityState,
        postalCode: billTo.postalCode || po.billTo.postalCode,
        phone: billTo.phone || po.billTo.phone,
        email: billTo.email || po.billTo.email
      };
    }
    if (services && Array.isArray(services)) {
      po.services = services.map(service => ({
        description: service.description,
        hours: service.hours,
        ratePerHour: service.ratePerHour,
        amount: service.hours * service.ratePerHour
      }));
    }
    if (taxRate !== undefined) po.taxRate = taxRate;
    if (notes !== undefined) po.notes = notes;
    // Status can only be updated by admin, not through this endpoint

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

    const po = await PO.findById(id);
    if (!po) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }

    // Verify the PO belongs to the logged-in client
    if (po.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this PO' });
    }

    await PO.findByIdAndDelete(id);

    res.status(200).json({ message: 'Purchase Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting PO:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve a Purchase Order (Admin only)
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

    // Add admin authorization check here (implementation depends on your auth system)
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
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

// Reject a Purchase Order (Admin only)
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

    // Add admin authorization check here (implementation depends on your auth system)
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
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