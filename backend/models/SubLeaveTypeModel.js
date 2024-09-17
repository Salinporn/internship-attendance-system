const getDbConnection = require("../config/db");

module.exports = {
  createTable: async function () {
    const connection = await getDbConnection();
    await connection.query(`
    CREATE TABLE IF NOT EXISTS SubLeaveTypes (
        id INT AUTO_INCREMENT,
        leaveTypeId INT,
        subtype VARCHAR(255) NOT NULL,
        subtype_status BOOLEAN DEFAULT 1,
        PRIMARY KEY (id),
        FOREIGN KEY (leaveTypeId) REFERENCES LeaveType(id)
    )
        `);
  },

insertSubLeaveType: async function (leaveTypeId, subtype) {
    const connection = await getDbConnection();
    await connection.query(
        "INSERT INTO SubLeaveTypes (leaveTypeId, subtype) VALUES (?, ?)",
        [leaveTypeId, subtype]
    );
},
  countSubType: async function () {
    const connection = await getDbConnection();
    const [rows] = await connection.query(
      "SELECT COUNT(*) AS count FROM SubLeaveTypes"
    );
    return rows[0].count;
  },
};
