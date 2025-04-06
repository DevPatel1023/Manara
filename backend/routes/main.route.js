// main.route.js
const express = require("express");
const router = express.Router();
const userRoute = require("../routes/user.route.js"); 
// const quoteRoute = require("../routes/quote.route.js"); 
const RFQRoute = require("../routes/RFQ.route.js"); 

router.use("/users", userRoute); 
// router.use("/quotations",quoteRoute);
router.use("/RFQS",RFQRoute);
module.exports = router;
