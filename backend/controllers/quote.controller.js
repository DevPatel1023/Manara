//quotation creation , allquotation , getquotation particular,update quotaion by id,delete quotaion

const Quotation = require("../models/quotation.model");

const createQuotation = async (req, res) => {
    try {
        const { clientId, description, amount } = req.body;
        if (!clientId || !description || !amount) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const newQuote = await Quotation.create({
            clientId,
            description,
            amount,
            createdBy: req.user.id  // Logged-in user
        });

        res.status(201).json({
            msg: "Quotation created successfully",
            quote: newQuote
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

const getAllQuotations = async (req, res) => {
    try {
        const quotes = await Quotation.find().populate("clientId", "firstName lastName email");
        res.status(200).json({ success: true, quotes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

const getQuotationById = async (req, res) => {
    try {
        const quote = await Quotation.findById(req.params.id).populate("clientId", "firstName lastName email");

        if (!quote) {
            return res.status(404).json({ msg: "Quotation not found" });
        }

        res.status(200).json({ success: true, quote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

const updateQuotation = async (req, res) => {
    try {
        const { description, amount, status } = req.body;
        const quote = await Quotation.findById(req.params.id);

        if (!quote) {
            return res.status(404).json({ msg: "Quotation not found" });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Access denied. Only admins can update quotations." });
        }

        quote.description = description || quote.description;
        quote.amount = amount || quote.amount;
        quote.status = status || quote.status;

        await quote.save();
        res.status(200).json({ msg: "Quotation updated successfully", quote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

const deleteQuotation = async (req, res) => {
    try {
        const quote = await Quotation.findById(req.params.id);

        if (!quote) {
            return res.status(404).json({ msg: "Quotation not found" });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Access denied. Only admins can delete quotations." });
        }

        await Quotation.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: "Quotation deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

module.exports = {
    createQuotation,
    getAllQuotations,
    getQuotationById,
    updateQuotation,
    deleteQuotation
};
