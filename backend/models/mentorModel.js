const bcrypt = require("bcryptjs");

const createMentorTable = async (pool) => {
  return pool.query(`
  CREATE TABLE IF NOT EXISTS Mentor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rfid VARCHAR(12) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255)  UNIQUE,
    pwd VARCHAR(255) NOT NULL,
    passwordUpdates INT DEFAULT 0,
    department VARCHAR(255),
    cloud_site VARCHAR(255),
    building VARCHAR(255),
    acc_status BOOLEAN DEFAULT 1,
    token VARCHAR(255)
  )
  `);
};

async function createMentor(pool, mentor) {
  try {
    const passwordHash = await bcrypt.hash(mentor.pwd, 12);
    const [rows] = await pool.query(
      `
    INSERT INTO Mentor (rfid, first_name, last_name, email, pwd, department, cloud_site, building)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        mentor.rfid,
        mentor.first_name,
        mentor.last_name,
        mentor.email,
        passwordHash,
        mentor.department,
        mentor.cloud_site,
        mentor.building,
      ]
    );

    return { success: true, insertId: rows.insertId };
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      console.log("Duplicate entry found");
      const duplicateField = error.sqlMessage.match(/key '(\w+)'/)[1];
      return {
        success: false,
        message: `Duplicate entry found for ${duplicateField}: ${mentor[duplicateField]}`,
      };
    }
    throw error;
  }
}

module.exports = { createMentorTable, createMentor };
