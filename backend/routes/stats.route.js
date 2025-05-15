const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/stats.controller.js");

router.get("/", getStats);

module.exports = router;