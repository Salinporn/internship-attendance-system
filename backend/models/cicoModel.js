const createCicoTable = async (pool) => {
  return pool.query(
    `
    CREATE TABLE IF NOT EXISTS ClockinClockout (
      id INT AUTO_INCREMENT PRIMARY KEY,
      rfid VARCHAR(255) NOT NULL,
      clockIn DATETIME,
      clockOut DATETIME,
      date DATE NOT NULL,
      FOREIGN KEY (rfid) REFERENCES Trainee(rfid) ON UPDATE CASCADE
    )
  `
  );
};

module.exports = createCicoTable;