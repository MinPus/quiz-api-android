const cors = require("cors");
const express = require('express');
const dotenv = require('dotenv');
const pool = require('./src/db'); // Import kết nối MySQL
const authRoutes = require('./src/routes/authRoutes');

dotenv.config();
const app = express();

// Đặt middleware CORS trước tất cả các route
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5000"], // Thêm cổng của Flutter web
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true // Nếu có dùng cookie hoặc session
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
        await pool.query('SELECT 1'); // Kiểm tra kết nối bằng một truy vấn đơn giản
        console.log('✅ Connected to MySQL database');
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1); // Thoát nếu không kết nối được database
    }
}

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    await checkDatabaseConnection(); // Kiểm tra kết nối DB khi server khởi động
});
