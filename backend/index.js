const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const connect = require("./db/connect.js");
const mainRouter = require("./routes/main.route.js");
const PORT = process.env.PORT;

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true})); 
app.use(cors({
        origin : 'http://localhost:5173'
}));
app.use("/api/v1/",mainRouter);

//server listening
app.listen(PORT,async()=>{
    console.log(`Server is running on port${PORT}`);
    await connect();
})
