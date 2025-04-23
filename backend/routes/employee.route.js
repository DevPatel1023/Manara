const express = require("express");
const { getAllEmployees } = require("../controllers/employee.controller");
const { authenticate, authorization } = require("../middlewares/Auth");
const router = express.Router();

// Route to get all employees (admin only)
router.get("/all", authenticate, authorization(["admin"]), getAllEmployees);

module.exports = router;