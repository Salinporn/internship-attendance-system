const getDbConnection = require("../config/db");
const mysql = require("mysql2/promise");

module.exports = {
  createTable: async function () {
    const connection = await getDbConnection();
    await connection.query(`
            CREATE TABLE IF NOT EXISTS LeaveType (
                id INT AUTO_INCREMENT PRIMARY KEY,
                leaveType VARCHAR(255) NOT NULL,
                type_status BOOLEAN DEFAULT 1
            )
        `);
  },

  insertLeaveType: async function (leaveType) {
    const connection = await getDbConnection();
    await connection.query("INSERT INTO LeaveType (leaveType) VALUES (?)", [
      leaveType,
    ]);
  },

  countLeaveTypes: async function () {
    const connection = await getDbConnection();
    const [rows] = await connection.query(
      "SELECT COUNT(*) AS count FROM LeaveType"
    );
    return rows[0].count;
  },
};
