const User = require("../models/user.model");
const Meeting = require('../models/meeting.model');
const Activity = require('../models/Activity.model');
const Customer = require('../models/customer.model');

const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" })
      .select("firstName lastName email phoneNo")

    res.status(200).json({
      employees,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching employees",
      error: error.message
    });
  }
};


const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ employeeId: req.user._id });
    res.status(200).json({ meetings });
  } catch (error) {
    console.error('Get meetings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ employeeId: req.user._id });
    res.status(200).json({ activities });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ employeeId: req.user._id });
    res.status(200).json({ customers });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = {
  getAllEmployees,
  getMeetings, 
  getCustomers, 
  getActivities
};