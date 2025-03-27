const RFQ = require("../models/RFQ.model.js");
// const user = require("../models/user.model.js");


// 1. create the rfq data and like saved it basically the rfq data in the database
const createRFQ = async (req, res) => {
    try {
        //rfq form data coming from the frontend body
        const { title, quantity, description, deadline } = req.body;
        if (!title || !quantity || !description || !deadline) {
            return res.status(400).json({
                msg: "All Fileds are required"
            });
        }

        const newRFQ = new RFQ({
            clientId: req.user.id,
            title,
            quantity,
            description,
            deadline
        });

        //store newRFQ in database
        await newRFQ.save();
        return res.status(200).json({
            msg: "RFQ created successfully",
            rfq: newRFQ
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal server error"
        });
    }

}


// 2.Get RFQs submitted by client
const getClientRFQS = async (req, res) => {
    try {
        const userid = req.user.id;
        //fetch the client
        const clientRfqs = await RFQ.find({ clientId: userid });
        if (clientRfqs.length === 0) {//check if array is empty
            return res.status(200).json({
                msg: "No RFQs found! please create one first.",
                "clientRfqs": []
            })
        }
        return res.status(200).json({
            msg: "Your RFQS:",
            clientRfqs
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal server error"
        });
    }

}

// 3. get all rfqs for the admin to seen where admin accepts or rejects the rfqs of clients
const getAllRFQs = async (req, res) => {
    try {
        const userid = req.user.id;
        if (!userid) {
            return res.status(404).json({
                msg: "Unauthorized user"
            });
        }
        //fetch all the rfqs and filter them show only pending rfqs
        const allpendingrfqs = await RFQ.find({ status: "pending" });// store object array 

        return res.status(200).json({
            msg: "The RFQS are :",
            allpendingrfqs
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal server error"
        })
    }
}

// 4. Update the status of the [accept , reject]
const updateStatusRFQ = async (req, res) => {
    try {
        const user = req.user;
        const { rfqId, statusRfq } = req.body;

        if (!rfqId || !["accepted", "rejected"].includes(statusRfq)) {
            return res.status(400).json({
                msg: "Invalid Request"
            })
        }

        //only admins update the rfqs
        if (user.role !== "admin") {
            return res.status(403).json({
                msg: "Forbidden : only admins can update the RFQ status"
            })
        }

        const updatedRFQ = await RFQ.findByIdAndUpdate(rfqId,
            { status : statusRfq },
            { new: true }
        )
        if (!updatedRFQ) {
            return res.status(404).json({ msg: "RFQ not found" });
        }

        return res.status(200).json({
            msg: `RFQ ${statusRfq} successfully`,
            updatedRFQ
        })

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createRFQ,
    getClientRFQS,
    getAllRFQs,
    updateStatusRFQ
}