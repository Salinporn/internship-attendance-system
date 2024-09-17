const bcrypt = require("bcryptjs");
const pool = require("../config/db.js");
// intern table
const createuserTable = async (pool) => {
  return pool.query(`
  CREATE TABLE IF NOT EXISTS Trainee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rfid VARCHAR(12) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    degree VARCHAR(255) ,
    major VARCHAR(255) ,
    university VARCHAR(255) ,
    start_date DATE ,
    end_date DATE ,
    email VARCHAR(255) NOT NULL UNIQUE,
    pwd VARCHAR(255) NOT NULL,
    passwordUpdates INT DEFAULT 0,
    department VARCHAR(255) ,
    cloud_site VARCHAR(255) ,
    building VARCHAR(255) ,
    mentor_rfid VARCHAR(12),
    birth_date DATE,
    acc_status BOOLEAN DEFAULT 1,
    FOREIGN KEY (mentor_rfid) REFERENCES Mentor(rfid) ON UPDATE CASCADE,
    token VARCHAR(255)
  )
  `);
};

async function createuser(pool, user) {
  try {
    const passwordHash = await bcrypt.hash(user.pwd, 12);

    const [rows] = await pool.query(
      `INSERT INTO Trainee (rfid, mentor_rfid, first_name, last_name, degree, major, university, start_date, end_date, email, pwd, department, cloud_site, building, birth_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
      [
        user.rfid,
        user.mentor_rfid,
        user.first_name,
        user.last_name,
        user.degree,
        user.major,
        user.university,
        user.start_date,
        user.end_date,
        user.email,
        passwordHash,
        user.department,
        user.cloud_site,
        user.building,
        user.birth_date,
      ]
    );
    return { success: true, insertId: rows.insertId };
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      console.log("Duplicate entry found");
      const duplicateField = error.sqlMessage.match(/key '(\w+)'/)[1];
      return {
        success: false,
        message: `Duplicate entry found for ${duplicateField}: ${user[duplicateField]}`,
      };
    }
    throw error;
  }
}

module.exports = { createuserTable, createuser };
