const User = require('../models/user.model')
const RFQ = require('../models/RFQ.model')
const Quotation = require('../models/Quotation.model')
const Invoice = require('../models/Invoice.model')

const adminDashboardData = async (req, res) => {
    try {
        const [customerCount, activeQuotation, pendingRFQs, monthlyRevenue] = await Promise.all([User.countDocuments({ role: 'client' }),
        Quotation.countDocuments({ status: 'accpeted' }),
        RFQ.countDocuments({ status: 'pending' }),
        Invoice.aggregate([

        ])
        ]);

        return res.status(200).json({
            customerCount,
            activeQuotation,
            pendingRFQs,
            monthlyRevenue
        })
    } catch (error) {
        console.error("Error fetching dashboard data", error);
    }
}

module.exports = {
    adminDashboardData,
}