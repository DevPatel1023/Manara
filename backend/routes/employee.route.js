const express = require("express");
const { getAllEmployees } = require("../controllers/employee.controller");
const { authenticate, authorization } = require("../middlewares/Auth");
const { getMeetings, getActivities, getCustomers } = require('../controllers/employee.controller');
const router = express.Router();

// Route to get all employees (admin only)
router.get("/all", authenticate, authorization(["admin"]), getAllEmployees);
router.get('/meetings',authenticate,
    authorization(["employee"]), getMeetings);
router.get('/activities',authenticate, authorization(['employee']), getActivities);
router.get('/customers',authenticate, authorization(['employee']), getCustomers);

module.exports = router;

module.exports = router;