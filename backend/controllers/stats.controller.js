const User = require("../models/user.model");
const Quotation = require("../models/Quotation.model");
const RFQ = require("../models/RFQ.model");
const PO = require("../models/PO.model");

const getStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: "client" });
    const activeQuotations = await Quotation.countDocuments({ status: "pending" });
    const pendingRfqs = await RFQ.countDocuments({ status: "pending" });
    const monthlyRevenue = await PO.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $multiply: [
                { $sum: "$services.amount" },
                { $add: [1, { $divide: ["$taxRate", 100] }] },
              ],
            },
          },
        },
      },
    ]);

    res.status(200).json({
      totalCustomers,
      activeQuotations,
      pendingRfqs,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = { getStats };