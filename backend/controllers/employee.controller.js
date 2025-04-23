const User = require("../models/user.model");

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

module.exports = {
  getAllEmployees
};