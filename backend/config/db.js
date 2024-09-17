const mysql = require('mysql2/promise');


const connectDB = async () => {
  try {
    let pool = mysql.createPool({
      host: 'localhost',
      user: 'sphie',
      password: 'cM!zm(Q!C4S]D)F',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    let connection = await pool.getConnection();

    await connection.query(`CREATE DATABASE IF NOT EXISTS ims`);
    connection.release();

    // Create a new pool that connects to the 'ims' database
    pool = mysql.createPool({
      host: 'localhost',
      user: 'sphie',
      password: 'cM!zm(Q!C4S]D)F',
      database: 'ims2',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log('MySQL connected...');
    return pool;
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
