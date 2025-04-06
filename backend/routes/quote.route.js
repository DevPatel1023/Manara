const express = require("express");
const router = express.Router();
const quotationController = require("../controllers/quotation.controller");

router.post("/create", quotationController.createQuotation);
router.get("/", quotationController.getAllQuotations);
router.get("/supplier/:supplierId", quotationController.getQuotationsBySupplier);
router.get("/rfq/:rfqId", quotationController.getQuotationsByRFQ);
router.patch("/status/:id", quotationController.updateQuotationStatus);
router.delete("/:id", quotationController.deleteQuotation);

module.exports = router;
