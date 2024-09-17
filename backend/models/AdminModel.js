const bcrypt = require("bcryptjs");
const pool = require("../config/db.js");

const createTable = async (pool) => {
  return pool.query(`
 CREATE TABLE IF NOT EXISTS Employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rfid VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(255) ,
  email VARCHAR(255) NOT NULL UNIQUE,
  pwd VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  site VARCHAR(255),
  building VARCHAR(255) ,
  passwordUpdates INT DEFAULT 0,
  acc_status BOOLEAN DEFAULT 1,
  token VARCHAR(255)
)
  `);
};

async function createEmployee(pool, employee) {
  try {
    const passwordHash = await bcrypt.hash(employee.pwd, 12);
    const [rows] = await pool.query(
      `INSERT INTO Employee (rfid, first_name, last_name, phone_number, email, pwd, department, site, building) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employee.rfid,
        employee.first_name,
        employee.last_name,
        employee.phone_number,
        employee.email,
        passwordHash,
        employee.department,
        employee.site,
        employee.building,
      ]
    );
    return { success: true, insertId: rows.insertId };
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      console.log("Duplicate entry found");
      const duplicateField = error.sqlMessage.match(/key '(\w+)'/)[1];
      return {
        success: false,
        message: `Duplicate entry found for ${duplicateField}: ${employee[duplicateField]}`,
      };
    }
  }
  throw error;
}

module.exports = {
  createTable,
  createEmployee,
};
