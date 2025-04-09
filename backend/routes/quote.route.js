const express = require("express");
const router = express.Router();
const quotationController = require("../controllers/quote.controller");
const { authenticate, authorization } = require("../middlewares/Auth");

// 🛠️ Create quotation — EMPLOYEE only
router.post(
    "/create",
    authenticate,
    authorization(["employee"]),
    quotationController.createQuotation
);

// 📋 Admin view all quotations
router.get(
    "/getall",
    authenticate,
    authorization(["admin"]),
    quotationController.getAllQuotations
);

// 🔍 Employee sees their own quotations
router.get(
    "/supplier/:supplierId",
    authenticate,
    authorization(["employee"]),
    quotationController.getQuotationsBySupplier
);

// 👀 Client sees quotations related to RFQs they created
router.get(
    "/rfq/:rfqId",
    authenticate,
    authorization(["client"]),
    quotationController.getQuotationsByRFQ
);
// 📦 Client gets all quotations for all RFQs they created
router.get(
    "/client",
    authenticate,
    authorization(["client"]),
    quotationController.getAllQuotationsForClient
  );
  

// ✅ Client can update quotation status for RFQs they created
router.patch(
    "/status/:id",
    authenticate,
    authorization(["client"]),
    quotationController.updateQuotationStatus
);

// ❌ Delete quotation — admin only (optional)
router.delete(
    "/:id",
    authenticate,
    authorization(["admin"]),
    quotationController.deleteQuotation
);

module.exports = router;
