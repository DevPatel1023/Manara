const express = require("express");
const { authenticate, authorization } = require("../middlewares/Auth.js");
const { createQuotation, getAllQuotations, getQuotationById, updateQuotation, deleteQuotation } = require("../controllers/quote.controller.js");

const router = express.Router();


router.post("/", authenticate, createQuotation);  
router.get("/", authenticate, authorization(["admin"]), getAllQuotations);  
router.get("/:id", authenticate, getQuotationById); 
router.patch("/:id", authenticate, authorization(["admin"]), updateQuotation);  
router.delete("/:id", authenticate, authorization(["admin"]), deleteQuotation);  

module.exports = router;
