const express = require("express");
const router = express.Router();
const { authenticate, authorization } = require("../middlewares/Auth.js");
const { createRFQ, getAllRFQs, updateStatusRFQ, getClientRFQS,getAssignedRFQsForEmployee } = require("../controllers/RFQ.controller.js");

router.post("/submitRfq", createRFQ);
router.get("/myRfqs", authenticate, getClientRFQS);
router.get("/getAllRFQS", authenticate, authorization(["admin"]), getAllRFQs);
router.patch("/updateRFQStatus", authenticate, authorization(["admin"]), updateStatusRFQ);
router.get("/accptedRFQs", authenticate, authorization(["employee"]), getAssignedRFQsForEmployee);


module.exports = router;
