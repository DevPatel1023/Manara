// main.route.js
const express = require("express");
const router = express.Router();
const userRoute = require("../routes/user.router.js"); 
const quoteRoute = require("../routes/quote.router.js"); 

router.use("/users", userRoute); 
router.use("/quotations",quoteRoute);
module.exports = router;
