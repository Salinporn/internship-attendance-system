const connectDB = require("./config/db");
const { createTable } = require("./models/AdminModel"); // admin table
const { createuserTable } = require("./models/TraineeModel.js"); // intern table
const { createMentorTable } = require("./models/mentorModel"); // mentor table


const {
  populateTimeAdjReasons,
  populateLeaveTypes,
  populatePeriodOfTime,
  populateSubLeaveTypes,
} = require("./models/Setup.js");
require("dotenv").config();
const express = require("express");
const route = require("./routes/postRoutes.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/AuthRoute.js");
const app = express();
const { verifyToken } = require('./middlewares/AuthMiddleware'); // Import the middleware

// Connect to MySQL
connectDB();

// Create tables if not exist

populateTimeAdjReasons();
populateLeaveTypes();
populatePeriodOfTime();
populateSubLeaveTypes();

//listen for requests
app.listen(process.env.PORT, '0.0.0.0', async () => {
  console.log("listening on port ", process.env.PORT);
  const pool = await connectDB();
  await createTable(pool);
  await createMentorTable(pool);
  await createuserTable(pool);
});

app.use(cors());

// Body-parsing middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/", authRoute);
app.use("/api", route);
// app.use("/api", verifyToken, route);