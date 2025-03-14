// File: db.js
require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true, // Duy trì kết nối
  keepAliveInitialDelay: 10000 // Sau 10 giây mới gửi keep-alive
});

module.exports = pool.promise();

