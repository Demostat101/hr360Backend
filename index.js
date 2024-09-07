const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const routes = require("./routes");
require("dotenv").config();
const cors = require("cors");

const PORT = process.env.PORT || 3500;

const app = express();


app.use(bodyParser.json());
app.use(cors({origin:"*", optionsSuccessStatus:200}));
app.use("/", routes);
app.use(express.urlencoded({extended:false}))


// route

app.use("/user",routes)



app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`);
})
