// main.route.js
const express = require("express");
const router = express.Router();
const userRoute = require("../routes/user.router.js"); // Import directly

router.use("/users", userRoute); // Mount user routes under /users

module.exports = router;
