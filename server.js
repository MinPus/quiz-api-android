const cors = require("cors");
const express = require('express');
const dotenv = require('dotenv');
const pool = require('./src/db');
const authRoutes = require('./src/routes/authRoutes');

dotenv.config();
const app = express();

// Log tất cả các yêu cầu để debug
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Cấu hình CORS
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5000", "http://localhost:53827"], // Thêm cổng của Flutter web
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
