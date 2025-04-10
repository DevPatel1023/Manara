const express = require('express');
const router = express.Router();
const poController = require('./po.controller');

router.post('/', poController.createPO);
router.get('/', poController.getAllPOs);
router.get('/:id', poController.getPOById);
router.put('/:id', poController.updatePO);
router.delete('/:id', poController.deletePO);
router.patch('/:id/approve', poController.approvePO);
router.patch('/:id/reject', poController.rejectPO);

module.exports = router;