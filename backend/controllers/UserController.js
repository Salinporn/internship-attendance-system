const { createMentorTable, createMentor } = require("../models/mentorModel.js"); // mentor table
const { createuserTable, createuser } = require("../models/TraineeModel.js"); // intern table
const csvParser = require("csv-parser");
const stream = require("stream");
const connectDB = require("../config/db.js");

let dbConnection;

// Call the connectDB function and store the result in dbConnection
connectDB().then((connection) => {
  dbConnection = connection;
});

// get admin by rfid - clear
const getAdminByRfid = async (req, res) => {
  try {
    const { rfid } = req.params;
    const [rows] = await dbConnection.query(
      `SELECT * FROM Employee WHERE rfid = ?`,
      [rfid]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "No admins found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all mentors - clear /
const getAllMentors = async (req, res) => {
  try {
    const [rows] = await dbConnection.query(
      `
      SELECT *, CONCAT(first_name, ' ', last_name) AS fullname FROM mentor`
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "No mentors found" });
    }
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get mentor rfid
const getMentor = async (req, res) => {
  const { rfid } = req.params;
  console.log("rfid: ", rfid);
  try {
    const [rows] = await dbConnection.query(
      `      SELECT * FROM mentor WHERE rfid = ?`,
      [rfid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get mentor rfid from trainee table
const getMentorRfid = async (req, res) => {
  const { rfid } = req.params;
  try {
    const [rows] = await dbConnection.query(
      `SELECT mentor_rfid FROM Trainee WHERE rfid = ?`,
      [rfid]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//  delete a mentor
const deleteMentor = async (req, res) => {
  const { rfid } = req.params;
  try {
    const result = await Mentor.findOneAndDelete({ rfid: rfid });
    if (!result) {
      return res.status(404).json({ message: "mentor not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update a mentor
const updateMentor = async (req, res, next) => {
  const rfid = req.params.rfid;
  const updates = req.body;

  // Start a transaction
  const pool = await dbConnection;
  await pool.query("START TRANSACTION");

  try {
    // Get the current rfid of the trainee
    const [rows] = await pool.query("SELECT rfid FROM Mentor WHERE rfid = ?", [
      rfid,
    ]);
    const oldRfid = rows[0].rfid;

    // Update Trainee
    let query = "UPDATE Mentor SET ? WHERE rfid = ?";
    await pool.query(query, [updates, rfid]);

    // If rfid is updated, update ClockinClockout, TimeAdjustment, and Absence
    if (updates.rfid && oldRfid !== updates.rfid) {
      // Check if TimeAdjustment table exists
      const [timeAdjustmentExists] = await pool.query(
        "SHOW TABLES LIKE 'TimeAdjustment'"
      );
      if (timeAdjustmentExists.length) {
        query = "UPDATE TimeAdjustment SET rfid = ? WHERE mentorRfid = ?";
        await pool.query(query, [updates.rfid, oldRfid]);
      }

      // Check if Absence table exists
      const [absenceExists] = await pool.query("SHOW TABLES LIKE 'Absence'");
      if (absenceExists.length) {
        query = "UPDATE Absence SET rfid = ? WHERE mentorRfid = ?";
        await pool.query(query, [updates.rfid, oldRfid]);
      }
    }

    // Commit the transaction
    await pool.query("COMMIT");

    // Send a response back to the client
    res.status(200).json({ message: "Mentor updated successfully." });
  } catch (error) {
    // If there is any error, rollback the transaction
    await pool.query("ROLLBACK");

    // Forward the error to the error handling middleware
    next(error);
  }
};

// get trainees
const getAllTrainees = async (req, res) => {
  try {
    const [rows] = await dbConnection.query(
      `SELECT Trainee.id,
        Trainee.rfid, 
        CONCAT(Trainee.first_name, ' ', Trainee.last_name) AS fullname, 
        Trainee.department,
        Trainee.cloud_site,
        Trainee.building,
        Trainee.email,
        Trainee.start_date, 
        Trainee.end_date, 
        Trainee.degree, 
        Trainee.major, 
        Trainee.university,
        Trainee.acc_status,
        CONCAT(Mentor.first_name, ' ', Mentor.last_name) AS mentor_name
      FROM 
        Trainee
      LEFT JOIN 
        Mentor ON Trainee.mentor_rfid = Mentor.rfid
      WHERE Trainee.mentor_rfid IS NOT NULL AND Trainee.mentor_rfid != ''`
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Trainee not found" });
    }

    const [expiredRows] = await dbConnection.query(
      `UPDATE Trainee SET acc_status = 0 WHERE end_date < CURDATE() AND acc_status <> 0`
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get trainee by rfid
const getTrainee = async (req, res) => {
  const { rfid } = req.params;
  console.log("rfid: ", rfid);
  try {
    const [rows] = await dbConnection.query(
      `SELECT * FROM Trainee WHERE rfid= ?`,
      [rfid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTrainee = async (req, res, next) => {
  const rfid = req.params.rfid;
  const updates = req.body;

  // Start a transaction
  const pool = await dbConnection;
  await pool.query("START TRANSACTION");

  try {
    // If mentor_rfid is being updated, check if it exists in the Mentor table
    if (updates.mentor_rfid) {
      const [mentorRows] = await pool.query(
        "SELECT rfid FROM Mentor WHERE rfid = ?",
        [updates.mentor_rfid]
      );
      if (mentorRows.length === 0) {
        return res.status(400).json({ message: "Mentor RFID does not exist" });
      }
    }

    // Get the current rfid of the trainee
    const [rows] = await pool.query("SELECT rfid FROM Trainee WHERE rfid = ?", [
      rfid,
    ]);
    const oldRfid = rows[0].rfid;

    // Update Trainee
    let query = "UPDATE Trainee SET ? WHERE rfid = ?";
    await pool.query(query, [updates, rfid]);

    // If rfid is updated, update ClockinClockout, TimeAdjustment, and Absence
    if (updates.rfid && oldRfid !== updates.rfid) {
      // Check if ClockinClockout table exists
      const [clockinClockoutExists] = await pool.query(
        "SHOW TABLES LIKE 'ClockinClockout'"
      );
      if (clockinClockoutExists.length) {
        query = "UPDATE ClockinClockout SET rfid = ? WHERE rfid = ?";
        await pool.query(query, [updates.rfid, oldRfid]);
      }

      // Check if TimeAdjustment table exists
      const [timeAdjustmentExists] = await pool.query(
        "SHOW TABLES LIKE 'TimeAdjustment'"
      );
      if (timeAdjustmentExists.length) {
        query = "UPDATE TimeAdjustment SET rfid = ? WHERE rfid = ?";
        await pool.query(query, [updates.rfid, oldRfid]);
      }

      // Check if Absence table exists
      const [absenceExists] = await pool.query("SHOW TABLES LIKE 'Absence'");
      if (absenceExists.length) {
        query = "UPDATE Absence SET rfid = ? WHERE rfid = ?";
        await pool.query(query, [updates.rfid, oldRfid]);
      }
    }

    // Commit the transaction
    await pool.query("COMMIT");

    // Send a response back to the client
    res.status(200).json({ message: "Trainee updated successfully." });
  } catch (error) {
    // If there is any error, rollback the transaction
    await pool.query("ROLLBACK");

    // Forward the error to the error handling middleware
    next(error);
  }
};

// upload trainee csv - clear
const uploadUserCSV = async (req, res) => {
  try {
    const pool = await dbConnection;
    await createuserTable(pool);

    const file = req.file;
    const results = [];

    // Create a readable stream from the buffer
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    bufferStream
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        console.log(results);
        // Check if the first row contains the correct column names
        const expectedColumns = [
          "no",
          "rfid",
          "mentor_rfid",
          "first_name",
          "last_name",
          "degree",
          "major",
          "university",
          "start_date",
          "end_date",
          "email",
          "pwd",
          "cloud_site",
          "department",
          "building",
          "birth_date",
        ].map((column) => column.toLowerCase());

        const csvColumns = Object.keys(results[0]).map((column) =>
          column.trim().toLowerCase()
        );

        if (!expectedColumns.every((column) => csvColumns.includes(column))) {
          return res.status(400).json({
            message: "CSV file does not have the correct column names",
          });
        }
        for (let i = 0; i < results.length; i++) {
          const mentorRfid = results[i].mentor_rfid;
          const [mentorRows] = await pool.query(
            "SELECT * FROM Mentor WHERE rfid = ?",
            [mentorRfid]
          );
          if (mentorRows.length === 0) {
            return res
              .status(400)
              .json({ message: `Mentor with RFID ${mentorRfid} not found` });
          }
          const trainee = {
            rfid: results[i].rfid,
            mentor_rfid: results[i].mentor_rfid,
            first_name: results[i].first_name,
            last_name: results[i].last_name,
            degree: results[i].degree,
            major: results[i].major,
            university: results[i].university,
            start_date: results[i].start_date,
            end_date: results[i].end_date,
            email: results[i].email,
            pwd: results[i].pwd,
            cloud_site: results[i].cloud_site,
            department: results[i].department,
            building: results[i].building,
            birth_date: results[i].birth_date,
          };

          const result = await createuser(pool, trainee);
          if (!result.success) {
            return res.status(400).json({ message: result.message });
          }
          console.log("results.success: ", result.success);
        }
        res.status(200).json({ message: "User uploaded successfully" });
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// upload mentor csv
const uploadMentorCSV = async (req, res) => {
  try {
    const pool = await dbConnection;
    await createMentorTable(pool);

    const file = req.file;
    const results = [];

    // Create a readable stream from the buffer
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    bufferStream
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        console.log(results);
        const expectedColumns = [
          "no",
          "id_supervisor",
          "first_name",
          "last_name",
          "email",
          "pwd",
          "cloud_site",
          "department",
          "building",
        ].map((column) => column.toLowerCase());
        const csvColumns = Object.keys(results[0]).map((column) =>
          column.trim().toLowerCase()
        );
        if (!expectedColumns.every((column) => csvColumns.includes(column))) {
          return res.status(400).json({
            message: "CSV file does not have the correct column names",
          });
        }

        for (let i = 0; i < results.length; i++) {
          const mentor = {
            rfid: results[i].ID_supervisor,
            first_name: results[i].first_name,
            last_name: results[i].last_name,
            email: results[i].email,
            pwd: results[i].pwd,
            cloud_site: results[i].cloud_site,
            department: results[i].department,
            building: results[i].building,
          };

          const result = await createMentor(pool, mentor);
          if (!result.success) {
            return res.status(400).json({ message: result.message });
          }
          console.log("results.success: ", result.success);
        }

        res.status(200).json({ message: "Mentor uploaded successfully" });
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateMentorAccountStatus = async (req, res) => {
  const { rfid } = req.params;
  const { acc_status } = req.body;
  try {
    const [rows] = await dbConnection.query(
      `UPDATE Mentor SET acc_status = ? WHERE rfid = ?`,
      [acc_status, rfid]
    );
    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User account status updated" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTraineetorAccountStatus = async (req, res) => {
  const { rfid } = req.params;
  const { acc_status } = req.body;
  try {
    const [rows] = await dbConnection.query(
      `UPDATE Trainee SET acc_status = ? WHERE rfid = ?`,
      [acc_status, rfid]
    );
    
    const [expiredRows] = await dbConnection.query(
      `UPDATE Trainee SET acc_status = 0 WHERE end_date < CURDATE() AND acc_status <> 0`
    );

    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User account status updated" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllMentors,
  getMentor,
  deleteMentor,
  updateMentor,
  getTrainee,
  updateTrainee,
  getAdminByRfid,
  getMentorRfid,
  uploadMentorCSV,
  uploadUserCSV,
  getAllTrainees,
  updateMentorAccountStatus,
  updateTraineetorAccountStatus,
};
