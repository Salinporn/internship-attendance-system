const getDbConnection = require("../config/db");
const mysql = require("mysql2/promise");



module.exports = {
  
  createTable: async function () {
    const connection = await getDbConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS PeriodOfTime (
        id INT AUTO_INCREMENT PRIMARY KEY,
        period VARCHAR(255) NOT NULL
      )
    `);
  },

  insertPeriod: async function (period) {
    const connection = await getDbConnection();
    await connection.query("INSERT INTO PeriodOfTime (period) VALUES (?)", [
      period,
    ]);
  },

  getPeriods: async function () {
    const connection = await getDbConnection();
    const [rows] = await connection.query("SELECT * FROM PeriodOfTime");
    return rows;
  },

  countPeriods: async function () {
    const connection = await getDbConnection();
    const [rows] = await connection.query(
      "SELECT COUNT(*) AS count FROM PeriodOfTime"
    );
    return rows[0].count;
  },
};
