const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const routes = require("./routes");
require("dotenv").config();
const cors = require("cors");

const PORT = process.env.PORT || 3500;

const app = express();
const allowedOrigins = [
    'http://localhost:5173',
    'https://hr360dashboard-omikunle-ademola.netlify.app',
  ];
  const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS',"PATCH","DELETE"], // Allowed methods
    allowedHeaders: ['Content-Type'], // Allowed headers
    credentials: true, // If you need to include credentials
  };
  
  // Use CORS middleware
  app.use(cors(corsOptions));
  
  // Handle OPTIONS method for preflight requests
  app.options('*', cors(corsOptions)); // Enable preflight across all routes


app.use(bodyParser.json());
// app.use(cors({origin:"*", optionsSuccessStatus:200}));


app.use("/", routes);
app.use(express.urlencoded({extended:false}))


// route

app.use("/user",routes)



app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`);
})
