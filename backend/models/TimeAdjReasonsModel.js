const getDbConnection = require('../config/db');
const mysql = require("mysql2/promise");

module.exports = {
  createTable: async function () {
    const connection = await getDbConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS TimeAdjReasons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        reason VARCHAR(255) NOT NULL,
        reason_status BOOLEAN DEFAULT 1
      )
    `);
  },

  insertReason: async function (reason) {
    const connection = await getDbConnection();
    await connection.query("INSERT INTO TimeAdjReasons (reason) VALUES (?)", [
      reason,
    ]);
  },

  countReasons: async function () {
    const connection = await getDbConnection();
    const [rows] = await connection.query(
      "SELECT COUNT(*) AS count FROM TimeAdjReasons"
    );
    return rows[0].count;
  },
};
