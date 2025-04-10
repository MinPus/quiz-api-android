const cors = require("cors");
const express = require('express');
const dotenv = require('dotenv');
const pool = require('./src/db');
const authRoutes = require('./src/routes/authRoutes');

dotenv.config();
const app = express();

// Cấu hình CORS để cho phép tất cả các nguồn gốc
app.use(cors({
    origin: "*", // Cho phép tất cả các nguồn gốc (dùng trong phát triển)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Middleware để parse JSON
app.use(express.json());

// Định nghĩa các route
app.use('/api', authRoutes);

// Route kiểm tra CORS
app.get("/test", (req, res) => {
  res.json({ message: "CORS has been enabled!" });
});

// Hàm kiểm tra kết nối database
async function checkDatabaseConnection() {
    try {
        await pool.query('SELECT 1');
        console.log('✅ Connected to MySQL database');
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1);
    }
}

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    await checkDatabaseConnection();
});