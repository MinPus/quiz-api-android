require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Số kết nối tối đa trong Pool
    queueLimit: 0,
    enableKeepAlive: true,  // Giữ kết nối luôn hoạt động
    idleTimeout: 30000, // Đóng kết nối sau 30 giây nếu không dùng
    maxIdle: 5 // Giữ tối đa 5 kết nối rảnh trong pool
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed: ", err);
        return;
    }
    console.log("Connected to MySQL database");
    connection.release(); // Giải phóng kết nối sau khi kiểm tra
});

module.exports = pool.promise();
