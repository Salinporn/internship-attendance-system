// const { model } = require("mongoose");
const connectDB = require("../config/db");
const { createTable, createEmployee } = require("../models/AdminModel");
// const { createTraineeTable, createTrainee } = require("../models/TraineeModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.AdminSignup = async (req, res, next) => {
  try {
    const pool = await connectDB();
    await createTable(pool); // Ensure the Employee table exists

    const {
      rfid,
      first_name,
      last_name,
      phone_number,
      email,
      pwd,
      department,
      site,
      building,
    } = req.body;

    const existingAdmin = await pool.query(
      "SELECT * FROM Employee WHERE rfid = ?",
      [rfid]
    );
    if (existingAdmin[0].length > 0) {
      return res.status(400).json({ message: "This user already exists" });
    }

    const employee = {
      rfid,
      first_name,
      last_name,
      phone_number,
      email,
      pwd,
      department,
      site,
      building,
    };

    createEmployee(pool, employee);

    res.status(201).json({
      message: "User signed up successfully",
      success: true,
      user: employee,
    });
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
module.exports.Login = async (req, res, next) => {
  let passwordUpdates;

  try {
    const { rfid, pwd } = req.body;
    if (!rfid || !pwd) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const pool = await connectDB();

    let [rows] = await pool.query(
      `SELECT rfid, pwd, 'trainee' as role, passwordUpdates, acc_status, token FROM Trainee WHERE rfid = ?
       UNION ALL
       SELECT rfid, pwd, 'admin' as role, passwordUpdates, acc_status, token FROM Employee WHERE rfid = ?
       UNION ALL
       SELECT rfid, pwd, 'mentor' as role, passwordUpdates, acc_status, token FROM Mentor WHERE rfid = ?`,
      [rfid, rfid, rfid]
    );

    let user = rows[0];
    let role = user ? user.role : null;
    if (user) {
      passwordUpdates = user.passwordUpdates;
    }
    console.log("passwordUpdates", passwordUpdates);

    if (!user) {
      return res.status(400).json({ message: "Incorrect RFID or password" });
    }

    if (user.acc_status !== 1) {
      return res.status(400).json({ message: "Account is not active" });
    }

    const auth = await bcrypt.compare(pwd, user.pwd);
    if (!auth) {
      return res.status(400).json({ message: "Incorrect RFID or password" });
    }

    let token = user.token;

    console.log("token", token);

    if (token === null) {
      const newToken = createSecretToken(rfid);
      let updateQuery;
      if (role === 'trainee') {
        updateQuery = `UPDATE Trainee SET token = ? WHERE rfid = ?`;
      } else if (role === 'admin') {
        updateQuery = `UPDATE Employee SET token = ? WHERE rfid = ?`;
      } else if (role === 'mentor') {
        updateQuery = `UPDATE Mentor SET token = ? WHERE rfid = ?`;
      }

      await pool.query(updateQuery, [newToken, rfid]);
      token = newToken;
    }

    console.log("new token", token)

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
    });
    
    res.status(201).json({
      message: "User signed in successfully",
      success: true,
      user: user,
      token: token,
      role: role,
      passwordUpdates: passwordUpdates,
    });

    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

module.exports.Logout = async (req, res, next) => {
  try {
    const { rfid } = req.body;
    console.log("RFID received for logout:", rfid);

    const pool = await connectDB();

    let [rows] = await pool.query(
      `SELECT 'trainee' as role FROM Trainee WHERE rfid = ?
       UNION ALL
       SELECT 'admin' as role FROM Employee WHERE rfid = ?
       UNION ALL
       SELECT 'mentor' as role FROM Mentor WHERE rfid = ?`,
      [rfid, rfid, rfid]
    );

    let user = rows[0];
    let role = user ? user.role : null;

    let updateQuery;
    if (role === 'trainee') {
      updateQuery = `UPDATE Trainee SET token = NULL WHERE rfid = ?`;
    } else if (role === 'admin') {
      updateQuery = `UPDATE Employee SET token = NULL WHERE rfid = ?`;
    } else if (role === 'mentor') {
      updateQuery = `UPDATE Mentor SET token = NULL WHERE rfid = ?`;
    }

    await pool.query(updateQuery, [rfid]);
    console.log("Token updated to null for RFID:", rfid);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console
    res.status(400).json({ message: error.message });
  }
};


module.exports.changePassword = async (req, res) => {
  const pool = await connectDB();
  const { rfid, old_pwd, new_pwd } = req.body;

  try {
    // Find the user in Employee table
    let [rows] = await pool.query(
      "SELECT rfid, pwd, 'admin' as role, passwordUpdates FROM Employee WHERE rfid = ?",
      [rfid]
    );

    let user;
    let tableName;

    // If found in Employee table, update password there
    if (rows.length > 0) {
      user = rows[0];
      tableName = "Employee";
    } else {
      // If not found in Employee table, find in Trainee or Mentor table
      [rows] = await pool.query(
        `SELECT rfid, pwd, 'trainee' as role, passwordUpdates FROM Trainee WHERE rfid = ?
         UNION ALL
         SELECT rfid, pwd, 'mentor' as role, passwordUpdates FROM Mentor WHERE rfid = ?`,
        [rfid, rfid]
      );

      // Check if user exists
      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      user = rows[0];
      tableName = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }

    // Check if old password is correct
    const isMatch = await bcrypt.compare(old_pwd, user.pwd);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(new_pwd, 12);

    // Update password in the corresponding table
    await pool.query(
      "UPDATE ?? SET pwd = ?, passwordUpdates = passwordUpdates + 1 WHERE rfid = ?",
      [tableName, hashedPassword, rfid]
    );

    res
      .status(200)
      .json({ message: "Password updated successfully", role: user.role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.forgotPassword = async (req, res) => {
  const pool = await connectDB();
  const { rfid, first_name, last_name, email } = req.body;

  try {
    // Query to get the user from the database
    const tables = ["Trainee", "Mentor", "Employee"];
    let user;

    for (let table of tables) {
      const [rows] = await pool.query(
        `SELECT * FROM ${table} WHERE rfid = ? AND first_name = ? AND last_name = ? AND email = ?`,
        [rfid, first_name, last_name, email]
      );

      if (rows[0]) {
        user = rows[0];
        break;
      }
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate a new password
    const newPassword = "password123";
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update password in all tables
    for (let table of tables) {
      const updatePasswordQuery = `UPDATE ${table} SET pwd = ? WHERE rfid = ?`;
      await pool.query(updatePasswordQuery, [passwordHash, rfid]);
      const resetPasswordUpdatesQuery = `UPDATE ${table} SET passwordUpdates = 0 WHERE rfid = ?`;
      await pool.query(resetPasswordUpdatesQuery, [rfid]);
    }

    res.status(200).json({
      message: "Password reset successfully",
      newPassword: newPassword,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

