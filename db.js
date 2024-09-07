const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.CONNECTION);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", ()=>{
    console.log("Database Connected successfully");
});