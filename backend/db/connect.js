const mongoose = require("mongoose");

async function connect() {
   try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log("Mongodb connected successfully");
   } catch (error) {
        console.log("Error in mongodb connection:",error);
        process.exit(1);
   }     
}

module.exports = connect ;