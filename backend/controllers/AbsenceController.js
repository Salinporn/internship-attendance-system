const connectDB = require("../config/db.js");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const mime = require("mime");
const createAbsenceTable = require("../models/absenceModel");

let dbConnection;

// Call the connectDB function and store the result in dbConnection
connectDB().then((connection) => {
  dbConnection = connection;
});

const checkDates = async (startDate, endDate, rfid) => {
  const pool = await connectDB();

  // Convert dates to YYYY-MM-DD format
  const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
  const formattedEndDate = new Date(endDate).toISOString().split('T')[0];

  console.log("formattedStartDate:", formattedStartDate)
  console.log("formattedEndDate:", formattedEndDate)
  console.log("rfid:", rfid)

  // Query the tables
  const tables = [
    { name: 'absence', columns: ['startDate', 'endDate', 'rfid'] },
    { name: 'timeadjustment', columns: ['startDate', 'endDate', 'rfid'] },
    { name: 'clockinclockout', columns: ['clockIn', 'clockOut', 'rfid'] },
  ];

  for (let table of tables) {
    const [rows] = await pool.query(
      `SELECT * FROM ${table.name} WHERE rfid = ? AND ((DATE(${table.columns[0]}) BETWEEN ? AND ?) OR (DATE(${table.columns[1]}) BETWEEN ? AND ?))`,
      [rfid, formattedStartDate, formattedEndDate, formattedStartDate, formattedEndDate]
    );

    if (rows.length > 0) {
      return true;
    }
  }

  return false;
};

const createAbsence = async (req, res) => {
  const pool = await connectDB();
  await createAbsenceTable(pool);
  let filePath;
  if (req.file) {
    filePath = req.file.path;
  }
  try {
    const {
      rfid,
      startDate,
      endDate,
      reason,
      type,
      subType,
      period,
      mentorRemark,
      approved,
      approvalDate,
      mentorRfid,
      date,
    } = req.body;

    const datesExist = await checkDates(startDate, endDate, rfid);

    if (datesExist) {
      return res.status(400).json({ message: 'Already time in or leave' });
    }

    const [result] = await pool.query(
      `INSERT INTO Absence (
        rfid,
        startDate,
        endDate,
        reason,
        type,
        subType,
        period,
        mentorRemark,
        approved,
        approvalDate,
        mentorRfid,
        filePath,
        date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        rfid,
        startDate,
        endDate,
        reason,
        type,
        subType,
        period,
        mentorRemark,
        approved,
        approvalDate,
        mentorRfid,
        filePath,
        date,
      ]
    );

    res.json({ message: "Absence created successfully", id: result.insertId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// for trainee
const getAllAbsencesByRfid = async (req, res) => {
  const { rfid } = req.params;
  try {
    const [rows] = await dbConnection.query(
      `
      SELECT 
      Absence.*,
      Trainee.rfid,
      CONCAT(Trainee.first_name, ' ', Trainee.last_name) AS trainee_fullname,
      Trainee.email,
      Trainee.mentor_rfid,
      CONCAT(Mentor.first_name, ' ', Mentor.last_name) AS mentor_fullname,
      leavetype.leaveType,
      subleavetypes.subtype,
      periodoftime.period 
    FROM 
    Absence 
    LEFT JOIN 
      Trainee ON Absence.rfid = Trainee.rfid
    LEFT JOIN
      subleavetypes ON Absence.subType = subleavetypes.id
    LEFT JOIN
      periodoftime ON Absence.period = periodoftime.id
    LEFT JOIN
      leavetype ON Absence.type = leavetype.id
    LEFT JOIN
      Mentor ON Trainee.mentor_rfid = Mentor.rfid
    WHERE 
    Absence.rfid = ?
    `,
      [rfid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Absence not found" });
    }

    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAbsencesByMentor = async (req, res) => {
  const { rfid } = req.params;
  try {
    const [rows] = await dbConnection.query(
      `
      SELECT 
      Absence.*,
      Trainee.rfid,
      CONCAT(Trainee.first_name, ' ', Trainee.last_name) AS trainee_fullname,
      Trainee.email,
      Trainee.mentor_rfid,
      CONCAT(Mentor.first_name, ' ', Mentor.last_name) AS mentor_fullname,
      leavetype.leaveType,
      subleavetypes.subtype,
      periodoftime.period 
    FROM 
    Absence 
    LEFT JOIN 
      Trainee ON Absence.rfid = Trainee.rfid
    LEFT JOIN
      subleavetypes ON Absence.subType = subleavetypes.id
    LEFT JOIN
      periodoftime ON Absence.period = periodoftime.id
    LEFT JOIN
      leavetype ON Absence.type = leavetype.id
    LEFT JOIN
      Mentor ON Trainee.mentor_rfid = Mentor.rfid
    WHERE 
      Absence.mentorRfid = ?
  `,
      [rfid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Absence not found" });
    }

    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// get all absences
const getAllAbsences = async (req, res) => {
  const { rfid } = req.params;
  try {
    const [rows] = await dbConnection.query(
      `
      SELECT 
      Absence.*,
      Trainee.rfid,
      CONCAT(Trainee.first_name, ' ', Trainee.last_name) AS trainee_fullname,
      Trainee.email,
      Trainee.mentor_rfid,
      CONCAT(Mentor.first_name, ' ', Mentor.last_name) AS mentor_fullname,
      leavetype.leaveType,
      subleavetypes.subtype,
      periodoftime.period,
      Trainee.cloud_site
    FROM 
    Absence 
    LEFT JOIN 
      Trainee ON Absence.rfid = Trainee.rfid
    LEFT JOIN
      subleavetypes ON Absence.subType = subleavetypes.id
    LEFT JOIN
      periodoftime ON Absence.period = periodoftime.id
    LEFT JOIN
      leavetype ON Absence.type = leavetype.id
    LEFT JOIN
      Mentor ON Trainee.mentor_rfid = Mentor.rfid
  
  `,
      [rfid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Absence not found" });
    }
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update
const updateAbsence = async (req, res) => {
  const { id } = req.params;
  const { approved, mentorRemark, approvalDate } = req.body;

  if (!id) {
    return res.status(400).json({ message: "rfid is required" });
  }

  try {
    const [result] = await dbConnection.query(
      `UPDATE Absence SET approved = ?, mentorRemark = ?, approvalDate =? WHERE id = ?`,
      [approved, mentorRemark, approvalDate, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Absence not found" });
    }

    const [updatedAbsence] = await dbConnection.query(
      `SELECT * FROM Absence WHERE rfid = ?`,
      [id]
    );

    res.status(200).json(updatedAbsence);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getNewAbsenceById = async (req, res) => {
  const { id } = req.params; // assuming rfid is a route parameter
  try {
    const [rows] = await dbConnection.query(
      `
      SELECT 
      Absence.*,
      Trainee.rfid,
      CONCAT(Trainee.first_name, ' ', Trainee.last_name) AS trainee_fullname,
      Trainee.email,
      Trainee.mentor_rfid,
      CONCAT(Mentor.first_name, ' ', Mentor.last_name) AS mentor_fullname,
      Trainee.cloud_site,
      leavetype.leaveType,
      subleavetypes.subtype,
      periodoftime.period 
    FROM 
    Absence 
    LEFT JOIN 
      Trainee ON Absence.rfid = Trainee.rfid
    LEFT JOIN
      subleavetypes ON Absence.subType = subleavetypes.id
    LEFT JOIN
      periodoftime ON Absence.period = periodoftime.id
    LEFT JOIN
      leavetype ON Absence.type = leavetype.id
    LEFT JOIN
      Mentor ON Trainee.mentor_rfid = Mentor.rfid
    WHERE 
      Absence.id = ?
    `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Absence not found" });
    }

    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all time TimeAdjustment reasons
const getTimeAdjustmentReasons = async (req, res) => {
  try {
    let query = `SELECT * FROM TimeAdjReasons`;
    const [rows] = await dbConnection.query(query);
    if (rows.length === 0) {
      return res.status(404).json({ message: "reasons not found" });
    }
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get TimeAdjustment reasons with status = 1
const getTimeAdjustmentReasonsActive = async (req, res) => {
  try {
    let query = `SELECT * FROM TimeAdjReasons WHERE reason_status = 1`;
    const [rows] = await dbConnection.query(query);
    if (rows.length === 0) {
      return res.status(404).json({ message: "reasons not found" });
    }
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get time adjustment reason by id
const getTimeAdjustmentReasonById = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }
  try {
    const [rows] = await dbConnection.query(
      `SELECT * FROM TimeAdjReasons WHERE id = ?`,
      [id]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTimeAdjustmentReason = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  if (!reason) {
    return res.status(400).json({ message: "Reason is required" });
  }

  try {
    const [result] = await dbConnection.query(
      `UPDATE TimeAdjReasons SET reason = ? WHERE id = ?`,
      [reason, id]
    );

    // make auto increment id for timeadjreasons table start from 1
    await dbConnection.query(
      'SET @count = 0'
    );

    await dbConnection.query(
      'UPDATE timeadjreasons SET id = @count:= @count + 1'
    );

    await dbConnection.query(
      'ALTER TABLE timeadjreasons AUTO_INCREMENT = 1'
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reason not found" });
    }

    const [updatedReason] = await dbConnection.query(
      `SELECT * FROM TimeAdjReasons WHERE id = ?`,
      [id]
    );

    res.status(200).json(updatedReason[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// create new time adjustment reason
const createTimeAdjustmentReason = async (req, res) => {
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ message: "Reason is required" });
  }

  const [rows] = await dbConnection.query(
    `SELECT * FROM TimeAdjReasons WHERE reason = ?`,
    [reason]

  );

  if (rows.length > 0) {
    return res.status(400).json({ message: "Reason already exists" });
  }

  try {
    const [result] = await dbConnection.query(
      `INSERT INTO TimeAdjReasons (reason) VALUES (?)`,
      [reason]
    );

    res.status(200).json({ message: "Reason created successfully", id: result.insertId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//  get all leave types
const getLeaveTypes = async (req, res) => {
  try {
    const [rows] = await dbConnection.query(`SELECT * FROM LeaveType`);
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all active leave types
const getLeaveTypesActive = async (req, res) => {
  try {
    let query = `SELECT * FROM LeaveType WHERE type_status = 1`;
    const [rows] = await dbConnection.query(query);
    if (rows.length === 0) {
      return res.status(404).json({ message: "leave types not found" });
    }
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get sub leave types by leave type id
const getSubLeaveTypes = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await dbConnection.query(
      `
    SELECT * FROM SubLeaveTypes WHERE leaveTypeId = ? and subtype_status = 1
  `,
      [id]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get leave type by id
const getLeaveTypeById = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await dbConnection.query(
      `
   SELECT * FROM LeaveType WHERE id = ?`,
      [id]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all leave types with their subtypes
const getLeaveTypesWithSubtypes = async (req, res) => {
  try {
    const [leaveTypes] = await dbConnection.query(`
      SELECT 
        leavetype.id,
        leavetype.leaveType,
        leavetype.type_status,
        COALESCE(JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', subleavetypes.id,
            'subtype', subleavetypes.subtype,
            'subtype_status', subleavetypes.subtype_status
          )
        ), JSON_ARRAY()) AS subtypes
      FROM LeaveType leavetype
      LEFT JOIN SubLeaveTypes subleavetypes ON leavetype.id = subleavetypes.leaveTypeId
      GROUP BY leavetype.id, leavetype.leaveType, leavetype.type_status
    `);

    res.status(200).json(leaveTypes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all leave types with their subtypes by id
const getLeaveTypesWithSubtypesById = async (req, res) => {
  const id = req.params.id;
  try {
    const [leaveTypeWithSubtypes] = await dbConnection.query(`
      SELECT 
        leavetype.id,
        leavetype.leaveType,
        leavetype.type_status,
        COALESCE(JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', subleavetypes.id,
            'subtype', subleavetypes.subtype,
            'subtype_status', subleavetypes.subtype_status
          )
        ), JSON_ARRAY()) AS subtypes
      FROM LeaveType leavetype
      LEFT JOIN SubLeaveTypes subleavetypes ON leavetype.id = subleavetypes.leaveTypeId
      WHERE leavetype.id = ?
      GROUP BY leavetype.id, leavetype.leaveType, leavetype.type_status
    `, [id]);

    if (leaveTypeWithSubtypes.length === 0) {
      return res.status(404).json({ error: 'Leave type not found' });
    }

    res.status(200).json(leaveTypeWithSubtypes[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateLeaveTypesWithSubtypes = async (req, res) => {
  const { id } = req.params;
  const { leaveType, subtypes, type_status } = req.body; // Destructure the request body

  if (leaveType === undefined || type_status === undefined) {
    return res.status(400).json({ error: "leaveType and type_status are required" });
  }

  const connection = await dbConnection.getConnection();

  try {
    await connection.beginTransaction(); // Begin a transaction

    // Update the main leave type, ensuring no fields are set to empty strings or null unintentionally
    const updateFields = [];
    const updateValues = [];

    if (leaveType !== undefined) {
      updateFields.push('leaveType = ?');
      updateValues.push(leaveType);
    }

    if (type_status !== undefined) {
      updateFields.push('type_status = ?');
      updateValues.push(type_status);
    }

    updateValues.push(id);

    if (updateFields.length > 0) {
      const query = `UPDATE leavetype SET ${updateFields.join(', ')} WHERE id = ?`;
      await connection.query(query, updateValues);
    }

    // Handle subtypes
    if (subtypes !== undefined) {
      await connection.query('DELETE FROM subleavetypes WHERE leaveTypeId = ?', [id]);

      if (Array.isArray(subtypes) && subtypes.length > 0) {
        for (const subtype of subtypes) {
          const { name, subtype_status } = subtype;
          await connection.query(
            'INSERT INTO subleavetypes (subtype, leaveTypeId, subtype_status) VALUES (?, ?, ?)',
            [name, id, subtype_status]
          );
        }
      }
    }

    await connection.commit(); // Commit the transaction

    // Fetch the updated leave type and its subtypes
    const [updatedLeaveTypeResult] = await connection.query('SELECT * FROM leavetype WHERE id = ?', [id]);
    const [updatedSubtypesResult] = await connection.query('SELECT * FROM subleavetypes WHERE leaveTypeId = ?', [id]);

    const updatedLeaveType = updatedLeaveTypeResult[0];
    updatedLeaveType.subtypes = updatedSubtypesResult;

    // make auto increment id for subleavetypes table start from 1
    await connection.query(
      'SET @count = 0'
    );

    await connection.query(
      'UPDATE subleavetypes SET id = @count:= @count + 1'
    );

    await connection.query(
      'ALTER TABLE subleavetypes AUTO_INCREMENT = 1'
    );

    res.status(200).json({ message: 'Leave type and subtypes updated successfully', updatedLeaveType });
  } catch (error) {
    await connection.rollback(); // Rollback the transaction in case of error
    res.status(400).json({ error: error.message });
  } finally {
    connection.release(); // Release the database connection
  }
};

const createLeaveType = async (req, res) => {
  const { leaveType, subtypes } = req.body; // Destructure the request body

  const connection = await dbConnection.getConnection(); // Get the database connection

  try {

    await connection.beginTransaction(); // Begin a transaction

    // Insert the main leave type
    const [leaveTypeResult] = await connection.query(
      'INSERT INTO LeaveType (leaveType) VALUES (?)',
      [leaveType]
    );

    // Insert the subtypes
    const subtypeArray = subtypes.split(/[\n,]+/); // Split by both newlines and commas
    for (const subtype of subtypeArray) {
      if (!subtype.trim()) {
        continue;
      }
      await connection.query(
        'INSERT INTO SubLeaveTypes (leaveTypeId, subtype) VALUES (?, ?)',
        [leaveTypeResult.insertId, subtype.trim()]
      );

      // make auto increment id for subleavetypes table start from 1
      await connection.query(
        'SET @count = 0'
      );

      await connection.query(
        'UPDATE subleavetypes SET id = @count:= @count + 1'
      );

      await connection.query(
        'ALTER TABLE subleavetypes AUTO_INCREMENT = 1'
      );
    }

    await connection.commit(); // Commit the transaction

    res.status(200).json({ message: 'Leave type created successfully' });
  } catch (error) {
    await connection.rollback(); // Rollback the transaction in case of error
    res.status(400).json({ error: error.message });
  } finally {
    connection.release(); // Release the database connection
  }
};

// get all period of time
const getPeriodOfTime = async (req, res) => {
  try {
    const [rows] = await dbConnection.query(`SELECT * FROM PeriodOfTime`);
    if (rows.length === 0) {
      return res.status(404).json({ message: "period not found" });
    }
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get period of time by id
const getPeriodOfTimeById = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await dbConnection.query(
      `
    SELECT * FROM PeriodOfTime WHERE id = ?`,
      [id]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get absences by mentor rfid
const getAbsencesByMentorRfid = async (req, res) => {
  const mentorRfid = req.params.mentorRfid;
  try {
    const [rows] = await dbConnection.query(
      `
    SELECT * FROM Absence WHERE mentorRfid = ?`,
      [mentorRfid]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "absences not found" });
    }
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get file by path from url

const getFile = async (req, res) => {
  let filePath = decodeURIComponent(req.params[0]);
  filePath = path.resolve(filePath);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File doesn't exist: ${err}`);
      return res.status(404).json({ message: "File not found" });
    } else {
      const mimeType = mime.lookup(filePath);
      res.setHeader("Content-Type", mimeType);
      res.sendFile(filePath);
    }
  });
};

const updateAdjReasonStatus = async (req, res) => {
  const { id } = req.params;
  const { reason_status } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  if (reason_status === undefined || reason_status === null) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const [result] = await dbConnection.query(
      `UPDATE TimeAdjReasons SET reason_status = ? WHERE id = ?`,
      [reason_status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reason not found" });
    }

    // Fetch updated reason after update
    const [updatedReason] = await dbConnection.query(
      `SELECT * FROM TimeAdjReasons WHERE id = ?`,
      [id]
    );

    res.status(200).json(updatedReason[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLeaveTypeStatus = async (req, res) => {
  const { id } = req.params;
  const { type_status } = req.body;

  console.log('ID:', id);
  console.log('Status:', type_status);

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  if (type_status === undefined || type_status === null) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const [result] = await dbConnection.query(
      `UPDATE LeaveType SET type_status = ? WHERE id = ?`,
      [type_status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Leave type not found" });
    }

    const [updatedLeaveType] = await dbConnection.query(
      `SELECT * FROM LeaveType WHERE id = ?`,
      [id]
    );

    res.status(200).json(updatedLeaveType[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSubTypeStatus = async (req, res) => {
  const leaveTypeId = req.params.id;
  const { subtype } = req.body;

  try {
    const { name, subtype_status } = subtype;
    const query = `
      UPDATE subleavetypes
      SET subtype_status = ?
      WHERE leaveTypeId = ? AND subtype = ?
    `;
    await dbConnection.query(query, [subtype_status ? 1 : 0, leaveTypeId, name]);

    res.status(200).json({ message: "Subtype status updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createAbsence,
  // getAbsence,
  getAllAbsences,
  updateAbsence,
  getTimeAdjustmentReasons,
  getTimeAdjustmentReasonsActive,
  getLeaveTypes,
  getLeaveTypesActive,
  getTimeAdjustmentReasonById,
  updateTimeAdjustmentReason,
  createTimeAdjustmentReason,
  getPeriodOfTime,
  getPeriodOfTimeById,
  // getAbsenceById,
  getLeaveTypeById,
  getAbsencesByMentorRfid,
  getFile,
  getAllAbsencesByRfid,
  getNewAbsenceById,
  getAbsencesByMentor,
  getSubLeaveTypes,
  checkDates,
  getLeaveTypesWithSubtypes,
  updateLeaveTypesWithSubtypes,
  getLeaveTypesWithSubtypesById,
  createLeaveType,
  updateAdjReasonStatus,
  updateLeaveTypeStatus,
  updateSubTypeStatus,
};
