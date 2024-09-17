const Trainee = require("../models/TraineeModel");
const Employee = require("../models/AdminModel");
const Mentor = require("../models/mentorModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const connectDB = require("../config/db");


let dbConnection;

connectDB().then((pool) => {
  dbConnection = pool;
});

module.exports.verifyToken = async (req, res, next) => {
  console.log("Cookies:", req.cookies);

  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  try {
    const [rows] = await dbConnection.query(
      `SELECT rfid FROM Trainee WHERE token = ?
       UNION ALL
       SELECT rfid FROM Employee WHERE token = ?
        UNION ALL
        SELECT rfid FROM Mentor WHERE token = ?`,
      [token, token, token]
    );

    const user = rows[0];

    if (!user) {
      return res.status(403).json({ message: 'Invalid token.' });
    }

    // If everything is good, save the decoded token to request for use in other routes
    req.rfid = user.rfid;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({ message: 'Failed to authenticate token.' });
  }
};

// // Middleware to check if the user is an admin
// exports.isAdmin = (req, res, next) => {
//   if (req.user && req.user.role === 'admin') {
//     next(); // proceed to the next middleware or route handler
//   } else {
//     res.status(403).json({ message: 'Forbidden: You do not have access to this resource.' });
//   }
// }

// // Middleware to check if the user is a trainee
// exports.isTrainee = (req, res, next) => {
//   if (req.user && req.user.role === 'trainee') {
//     next(); // proceed to the next middleware or route handler
//   } else {
//     res.status(403).json({ message: 'Forbidden: You do not have access to this resource.' });
//   }
// }

// // Middleware to check if the user is a mentor
// exports.isMentor = (req, res, next) => {
//   if (req.user && req.user.role === 'mentor') {
//     next(); // proceed to the next middleware or route handler
//   } else {
//     res.status(403).json({ message: 'Forbidden: You do not have access to this resource.' });
//   }
// }