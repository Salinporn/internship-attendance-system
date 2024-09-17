const connectDB = require("../config/db.js");
const createTimeAdjustmentTable = require("../models/timeAdjustmentModel");
const { checkDates } = require('./AbsenceController');

let dbConnection;

connectDB().then((connection) => {
  dbConnection = connection;
});

// Create
const createTimeAdjustment = async (req, res) => {
  const pool = await connectDB();
  await createTimeAdjustmentTable(pool);
  let filePath;
  if (req.file) {
    filePath = req.file.path;
  }

  try {
    const {
      rfid,
      startDate,
      endDate,
      reasons,
      traineeRemark,
      mentorRemark,
      approved,
      approvalDate,
      mentorRfid,
      date,
      startDateWithNoTime,
      endDateWithNoTime,
      isCico,
      cicoId,
    } = req.body;

    const datesExist = await checkDates(startDate, endDate, rfid);
    if (datesExist) {
      console.log("datesExist:", datesExist)
      return res.status(400).json({ message: "This form already submitted" });
    }
    const [result] = await dbConnection.query(
      `INSERT INTO TimeAdjustment (
        rfid,
        startDate,
        endDate,
        reasons,
        traineeRemark,
        mentorRemark,
        approved,
        approvalDate,
        mentorRfid,
        filePath,
        date,
        startDateWithNoTime,
        endDateWithNoTime,
        isCico,
        cicoId
      
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)`,
      [
        rfid,
        startDate,
        endDate,
        reasons,
        traineeRemark,
        mentorRemark,
        approved,
        approvalDate,
        mentorRfid,
        filePath,
        date,
        startDateWithNoTime,
        endDateWithNoTime,
        isCico,
        cicoId,
      ]
    );
    res.json({
      message: "Time adjustment created successfully",
      id: result.insertId,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getNewTimeAdjustmentsByRfid = async (req, res) => {
  const { rfid } = req.params;
  try {
    const [rows] = await dbConnection.query(
      `
      SELECT 
      timeadjustment.*,
      Trainee.rfid,
      CONCAT(Trainee.first_name, ' ', Trainee.last_name) AS trainee_fullname,
      Trainee.email,
      Trainee.mentor_rfid,
      CONCAT(Mentor.first_name, ' ', Mentor.last_name) AS mentor_fullname,
      TimeAdjReasons.reason    
    FROM 
      timeadjustment 
    LEFT JOIN 
      Trainee ON timeadjustment.rfid = Trainee.rfid
    LEFT JOIN 
      TimeAdjReasons ON timeadjustment.reasons = TimeAdjReasons.id 
    LEFT JOIN
      Mentor ON timeadjustment.mentorRfid = Mentor.rfid
    WHERE 
      timeadjustment.rfid = ?
      `,
      [rfid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Time adjustment not found" });
    }

    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// get by id
const getNewTimeAdjustmentsById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await dbConnection.query(
      `
      SELECT 
      timeadjustment.*,
      Trainee.rfid,
      CONCAT(Trainee.first_name, ' ', Trainee.last_name) AS trainee_fullname,
      Trainee.email,
      Trainee.mentor_rfid,
      CONCAT(Mentor.first_name, ' ', Mentor.last_name) AS mentor_fullname,
      TimeAdjReasons.reason,
      Trainee.cloud_site    
    FROM 
      timeadjustment 
    LEFT JOIN 
      Trainee ON timeadjustment.rfid = Trainee.rfid
    LEFT JOIN 
      TimeAdjReasons ON timeadjustment.reasons = TimeAdjReasons.id 
    LEFT JOIN
      Mentor ON Trainee.mentor_rfid = Mentor.rfid
    WHERE 
      timeadjustment.id = ?
    `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Time adjustment not found" });
    }

    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getNewTimeAdjustments = async (req, res) => {
  try {
    const [rows] = await dbConnection.query(
      `
      SELECT 
      timeadjustment.*,
      Trainee.rfid,
      CONCAT(Trainee.first_name, ' ', Trainee.last_name) AS trainee_fullname,
      Trainee.email,
      Trainee.mentor_rfid,
      CONCAT(Mentor.first_name, ' ', Mentor.last_name) AS mentor_fullname,
      TimeAdjReasons.reason,
      Trainee.cloud_site    
    FROM 
      timeadjustment 
    LEFT JOIN 
      Trainee ON timeadjustment.rfid = Trainee.rfid
    LEFT JOIN 
      TimeAdjReasons ON timeadjustment.reasons = TimeAdjReasons.id 
    LEFT JOIN
      Mentor ON timeadjustment.mentorRfid = Mentor.rfid
   
    `
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Time adjustment not found" });
    }

    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get time adjustment by mentor rfid
const getTimeAdjustmentByMentorRfid = async (req, res) => {
  const { rfid } = req.params;
  try {
    const [rows] = await dbConnection.query(
      `  
      SELECT 
      timeadjustment.*,
      Trainee.rfid,
      CONCAT(Trainee.first_name, ' ', Trainee.last_name) AS trainee_fullname,
      Trainee.email,
      Trainee.mentor_rfid,
      CONCAT(Mentor.first_name, ' ', Mentor.last_name) AS mentor_fullname,
      TimeAdjReasons.reason    
    FROM 
      timeadjustment 
    LEFT JOIN 
      Trainee ON timeadjustment.rfid = Trainee.rfid
    LEFT JOIN 
      TimeAdjReasons ON timeadjustment.reasons = TimeAdjReasons.id 
    LEFT JOIN
      Mentor ON Trainee.mentor_rfid = Mentor.rfid
    WHERE 
      timeadjustment.mentorRfid = ?
      `,
      [rfid]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "TimeAdjustment not found" });
    }
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTimeAdjustment = async (req, res) => {
  const { id } = req.params;
  const { approved, mentorRemark, approvalDate } = req.body;

  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }

  try {
    const [result] = await dbConnection.query(
      `UPDATE timeadjustment SET approved = ?, mentorRemark = ?, approvalDate =? WHERE id = ?`,
      [approved, mentorRemark, approvalDate, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Timeadjustment not found" });
    }

    const [timeAdjustmentRecords] = await dbConnection.query(
      `SELECT startDate, endDate, isCico, cicoId  FROM timeadjustment WHERE id = ?`,
      [id]
    );

    if (!timeAdjustmentRecords || timeAdjustmentRecords.length === 0) {
      console.log("No timeadjustment record found with id:", id);
      return res
        .status(404)
        .json({ message: "No timeadjustment record found" });
    }

    const { startDate, endDate, isCico, cicoId } = timeAdjustmentRecords[0];

    console.log("isCico:", isCico);
    console.log("startDate:", startDate);
    console.log("endDate:", endDate);
    console.log("cicoId:", cicoId);

    console.log("approved:", approved);

    if (isCico === "1" && approved === "approved") {
      const [currentRecord] = await dbConnection.query(
        `SELECT clockIn, clockOut FROM clockinclockout WHERE id = ?`,
        [cicoId]
      );

      console.log("currentRecord.clockIn: ", currentRecord[0].clockIn);
      console.log("currentRecord.clockOut: ", currentRecord[0].clockOut);

      let updateQuery = "";
      let queryParams = [];

      if (currentRecord[0].clockIn === null) {
        updateQuery = `UPDATE clockinclockout SET clockIn = ? WHERE id = ?`;
        queryParams = [startDate, cicoId];
      } else if (currentRecord[0].clockOut === null) {
        updateQuery = `UPDATE clockinclockout SET clockOut = ? WHERE id = ?`;
        queryParams = [endDate, cicoId];
      }

      if (updateQuery) {
        await dbConnection.query(updateQuery, queryParams);
      }
    }

    const [updatedTimeAdjustment] = await dbConnection.query(
      `SELECT * FROM timeadjustment WHERE id = ?`,
      [id]
    );

    res.status(200).json(updatedTimeAdjustment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTimeAdjustmentReasons = async (req, res) => {
  try {
    const [rows] = await dbConnection.query(`SELECT * FROM TimeAdjReasons`);
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createTimeAdjustment,
  updateTimeAdjustment,
  getTimeAdjustmentByMentorRfid,
  getNewTimeAdjustmentsByRfid,
  getNewTimeAdjustmentsById,
  getNewTimeAdjustments,
  getTimeAdjustmentReasons,
};
