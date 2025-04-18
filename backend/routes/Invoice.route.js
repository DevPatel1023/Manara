const express = require('express');
const router = express.Router();
const { 
  getAllInvoices,
  getClientInvoices, 

} = require('../controllers/invoice.controller');
const { authenticate, authorization } = require('../middlewares/Auth');


// Client gets invoices for their POs
router.get('/getclientinvoice', authenticate, authorization('client'), getClientInvoices);
router.get('/getall', authenticate, authorization('admin'), getAllInvoices);

module.exports = router;