const express = require('express');
const router = express.Router();
const poController = require('../controllers/po.controller');
const { authenticate, authorization } = require("../middlewares/Auth.js");

// Create a new Purchase Order
router.post(
  '/submitpo',
  authenticate,
  authorization(['client']), // Example roles: Adjust as needed
  poController.createPO
);

// Get all Purchase Orders
router.get(
  '/purchase-orders',
  authenticate,
  authorization(['admin']), // Example roles: Adjust as needed
  poController.getAllPOs
);

// Get a specific Purchase Order by ID
router.get(
  '/purchase-orders/:id',
  authenticate,
  authorization(['admin', 'client']), // Example roles: Adjust as needed
  poController.getPOById
);

// Update a Purchase Order by ID
router.put(
  '/purchase-orders/:id',
  authenticate,
  authorization(['admin']), // Example roles: Adjust as needed
  poController.updatePO
);

// Delete a Purchase Order by ID
router.delete(
  '/purchase-orders/:id',
  authenticate,
  authorization(['admin']), // Example roles: Adjust as needed
  poController.deletePO
);

// Approve a Purchase Order by ID
router.patch(
  '/purchase-orders/:id/approve',
  authenticate,
  authorization(['admin', 'employee']), // Example roles: Adjust as needed
  poController.approvePO
);

// Reject a Purchase Order by ID
router.patch(
  '/purchase-orders/:id/reject',
  authenticate,
  authorization(['admin', 'employee']), // Example roles: Adjust as needed
  poController.rejectPO
);

module.exports = router;