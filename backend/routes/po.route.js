const express = require('express');
const router = express.Router();
const poController = require('../controllers/po.controller');
const { authenticate, authorization } = require('../middlewares/Auth');

// Create a new PO (clients only)
router.post('/submitpo', authenticate, authorization('client'), poController.createPO);

// Update PO status (authenticated users)
router.put('/status/:id', authenticate, poController.updatePOStatus);

// View all POs (authenticated users)
router.get('/all', authenticate, authorization(['admin', 'client']), poController.viewAllPOs);

// View client's approved POs
router.get("/client", authenticate, authorization("client"), poController.getClientPOs);

module.exports = router;