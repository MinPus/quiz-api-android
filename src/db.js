// File: db.js
require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createPool({
    
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
    keepAliveInitialDelay: 10000, // 0 by default.
    enableKeepAlive: true, // false by default.
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed: ", err);
        return;
    }
    console.log("Connected to MySQL database");
});

module.exports = db;
