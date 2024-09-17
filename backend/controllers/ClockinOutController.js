const connectDB = require("../config/db.js");
const dayjs = require("dayjs");
const createClockinClockoutTable = require("../models/cicoModel");

let dbConnection;

// Call the connectDB function and store the result in dbConnection
connectDB().then((connection) => {
  dbConnection = connection;
});

const createClockinClockout = async (req, res) => {
  const pool = await connectDB();
  await createClockinClockoutTable(pool);

  const date = new Date();
  console.log("date: ", date);
  const options = { timeZone: "Asia/Bangkok", hour12: true };
  const dateInThailand = date.toLocaleString("en-US", options);
  const currentDate = dayjs(dateInThailand).format("YYYY-MM-DD");

  try {
    const { rfid, clockIn, clockOut, date } = req.body;

    // Check if there's already a record for the user's RFID and the current date
    const [existingRecords] = await dbConnection.query(
      `SELECT * FROM ClockinClockout WHERE rfid = ? AND DATE(date) = ?`,
      [rfid, currentDate]
    );

    if (existingRecords.length > 0) {
      return res.status(400).json({ error: "Already clock In/ out" });
    }

    const [result] = await dbConnection.query(
      `INSERT INTO ClockinClockout (rfid, clockIn, clockOut, date)
      VALUES (?, ?, ?, ?)`,
      [rfid, clockIn, clockOut, date]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update clock out from null to clock out time
const updateClockinClockout = async (req, res) => {
  const pool = await connectDB();
  await createClockinClockoutTable(pool);

  const date = new Date();
  console.log("date: ", date);
  const options = { timeZone: "Asia/Bangkok", hour12: true };
  const dateInThailand = date.toLocaleString("en-US", options);
  try {
    const { rfid } = req.params;
    const { clockOut, date } = req.body;
    const currentDate = dayjs(dateInThailand).format("YYYY-MM-DD");
    console.log("currentdate: ", currentDate);

    // Select and log the date
    const [rows] = await dbConnection.query(
      `SELECT DATE(date) as date FROM ClockinClockout WHERE rfid = ? AND DATE(date) = ?`,
      [rfid, currentDate]
    );

    if (rows.length > 0) {
      console.log(rows[0].date);
    } else {
      console.log("No records found for the given RFID and date");
    }
    // Update the clockOut time
    const [result] = await dbConnection.query(
      `UPDATE ClockinClockout SET clockOut = ? WHERE rfid = ? AND DATE(date) = ?`,
      [clockOut, rfid, currentDate]
    );

    if (result.affectedRows === 0) {
      // No record found for the given RFID and date, create a new record
      const [insertResult] = await dbConnection.query(
        `INSERT INTO ClockinClockout (rfid, clockIn, clockOut, date)
        VALUES (?, NULL, ?, ?)`,
        [rfid, clockOut, date]
      );
      return res.status(201).json({ id: insertResult.insertId });
    }

    res.status(200).json({ message: "Clock-out time updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get clockin clockout by rfid
const getClockinClockoutbyRfid = async (req, res) => {
  const { rfid } = req.params;

  try {
    const [rows] = await dbConnection.query(
      `SELECT * FROM ClockinClockout WHERE rfid = ?`,
      [rfid]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "clockinClockout not found" });
    }
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get cico by id
const getClockinClockoutbyId = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await dbConnection.query(
      `SELECT * FROM ClockinClockout WHERE id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "clockinClockout not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getNewCico = async (req, res) => {
  try {
    const [rows] = await dbConnection.query(`
    SELECT
      clockinclockout.*,
      
      CONCAT(trainee.first_name, ' ', trainee.last_name) AS fullname,
      Trainee.cloud_site

    FROM 
      clockinclockout
    LEFT JOIN
      trainee ON clockinclockout.rfid = trainee.rfid
    `);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Clock In/Out not found" });
    }
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// approveTimeAdjustment clockin/out
const approveTimeAdjustmentCC = async (pool, timeAdjustmentId, mentorRfid) => {
  // First, update the TimeAdjustment to 'approved'
  await pool.query(
    `
    UPDATE TimeAdjustment
    SET approved = 'approved', mentorRfid = ?
    WHERE id = ?
  `,
    [mentorRfid, timeAdjustmentId]
  );

  // Then, get the updated TimeAdjustment
  const [timeAdjustments] = await pool.query(
    `
    SELECT * FROM TimeAdjustment WHERE id = ?
  `,
    [timeAdjustmentId]
  );

  const timeAdjustment = timeAdjustments[0];

  // If the TimeAdjustment was successfully approved
  if (timeAdjustment.approved === "approved") {
    // Update the ClockinClockout table
    if (timeAdjustment.isCico === "1") {
      // Update clockIn to 8:00 AM if it is NULL
      await pool.query(
        `
        UPDATE ClockinClockout
        SET clockIn = IF(clockIn IS NULL, DATE_ADD(?, INTERVAL 8 HOUR), clockIn)
        WHERE rfid = ?
      `,
        [timeAdjustment.startDate, timeAdjustment.rfid]
      );

      // Update clockOut to 5:00 PM if it is NULL
      await pool.query(
        `
        UPDATE ClockinClockout
        SET clockOut = IF(clockOut IS NULL, DATE_ADD(?, INTERVAL 17 HOUR), clockOut)
        WHERE rfid = ?
      `,
        [timeAdjustment.endDate, timeAdjustment.rfid]
      );
    }
  }
};

module.exports = {
  createClockinClockout,
  updateClockinClockout,
  getClockinClockoutbyRfid,
  getNewCico,
  approveTimeAdjustmentCC,
  getClockinClockoutbyId,
};
