const createTimeAdjustmentTable = async (pool) => {
  return pool.query(`CREATE TABLE IF NOT EXISTS TimeAdjustment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rfid VARCHAR(12) NOT NULL,
    startDate DATETIME,
    endDate DATETIME,
    startDateWithNoTime DATE,
    endDateWithNoTime DATE,
    reasons INT,
    traineeRemark VARCHAR(255) NOT NULL,
    mentorRemark VARCHAR(255),
    mentorRfid VARCHAR(255),
    approved ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approvalDate DATETIME,
    isCico Enum('0', '1') DEFAULT '0',
    cicoId INT,
    filePath VARCHAR(255),
    date DATETIME NOT NULL,
    FOREIGN KEY (rfid) REFERENCES Trainee(rfid) ON UPDATE CASCADE,
    FOREIGN KEY (reasons) REFERENCES TimeAdjReasons(id) ON UPDATE CASCADE,
    FOREIGN KEY (mentorRfid) REFERENCES Mentor(rfid) ON UPDATE CASCADE,
    FOREIGN KEY (cicoId) REFERENCES clockinclockout(id) ON UPDATE CASCADE
  )`);
};

module.exports = createTimeAdjustmentTable;