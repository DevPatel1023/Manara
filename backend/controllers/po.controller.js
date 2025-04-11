const PO = require('../models/PO.model');
const mongoose = require('mongoose');

const createPO = async (req, res) => {
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

    // Ensure user is authenticated and has client role (handled by middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: No user authenticated' });
    }
    const clientId = req.user.id;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(quotationId)) {
      return res.status(400).json({ message: 'Invalid Quotation ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ message: 'Invalid Client ID' });
    }

    // Basic required field validation
    if (
      !quotationId ||
      !poNumber ||
      !date ||
      !deliveryDate ||
      !billTo ||
      !services ||
      !billTo.company ||
      !billTo.address ||
      !billTo.cityState ||
      !billTo.postalCode ||
      !billTo.phone ||
      !billTo.email ||
      !Array.isArray(services) ||
      services.length === 0
    ) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Validate services
    for (const service of services) {
      if (!service.description || service.hours == null || service.ratePerHour == null) {
        return res.status(400).json({ message: 'All service fields (description, hours, ratePerHour) are required' });
      }
      if (service.hours < 0 || service.ratePerHour < 0) {
        return res.status(400).json({ message: 'Service hours and ratePerHour cannot be negative' });
      }
    }

    // Create new PO
    const newPO = new PO({
      clientId,
      quotationId,
      poNumber: `PO-${poNumber}`, // Prefix added as per previous logic
      date: new Date(date),
      deliveryDate: new Date(deliveryDate),
      billTo,
      services: services.map(service => ({
        description: service.description,
        hours: service.hours,
        ratePerHour: service.ratePerHour,
        amount: service.hours * service.ratePerHour,
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
    if (error.code === 11000) {
      return res.status(400).json({ message: 'PO number already exists' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updatePOStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid PO ID' });
    }

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be pending, approved, or rejected' });
    }

    const po = await PO.findById(id);
    if (!po) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }

    // No clientId check for admin
    po.status = status;
    const updatedPO = await po.save();

    res.status(200).json({
      message: 'PO status updated successfully',
      po: updatedPO,
    });
  } catch (error) {
    console.error('Error updating PO status:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const viewAllPOs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter based on user role.
    // If the user is not an admin, only return POs for that client.
    const filter = req.user && req.user.role === 'admin' ? {} : { clientId: req.user.id };

    const pos = await PO.find(filter)
      .populate('clientId', 'name email')
      .populate('quotationId', 'quotationNumber')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await PO.countDocuments(filter);

    res.status(200).json({
      message: 'POs retrieved successfully',
      pos,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error('Error viewing POs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createPO,
  updatePOStatus,
  viewAllPOs,
};