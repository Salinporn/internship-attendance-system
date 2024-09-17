const createAbsenceTable = async (pool) => {
  return pool.query(`
  CREATE TABLE IF NOT EXISTS Absence (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rfid VARCHAR(12) NOT NULL,
    startDate DATE,
    endDate DATE,
    reason VARCHAR(255),
    type INT,
    subType INT NULL,
    period INT,
    mentorRemark VARCHAR(255),
    mentorRfid VARCHAR(255),
    approved ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approvalDate DATETIME,
    filePath VARCHAR(255),
    date DATETIME NOT NULL,
    FOREIGN KEY (rfid) REFERENCES Trainee(rfid) ON UPDATE CASCADE,
    FOREIGN KEY (type) REFERENCES LeaveType(id) ON UPDATE CASCADE,
    FOREIGN KEY (period) REFERENCES PeriodOfTime(id) ON UPDATE CASCADE,
    FOREIGN KEY (mentorRfid) REFERENCES Mentor(rfid) ON UPDATE CASCADE,
    FOREIGN KEY (subType) REFERENCES SubLeaveTypes(id) ON UPDATE CASCADE
  )
  `);
};

module.exports = createAbsenceTable;