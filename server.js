const cors = require("cors");
const express = require('express');
const dotenv = require('dotenv');
const pool = require('./src/db'); // Import kết nối MySQL
const authRoutes = require('./src/routes/authRoutes');

dotenv.config();
const app = express();
app.use(express.json());
app.use('/api', authRoutes);

const PORT = process.env.PORT || 3000;

// Cấu hình CORS cho phép frontend truy cập
app.use(cors({
    origin: "http://localhost:5173", // Hoặc URL của frontend trên mạng
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true // Nếu có dùng cookie hoặc session
  }));

// Các route API của bạn ở đây
app.get("/test", (req, res) => {
  res.json({ message: "CORS đã được bật!" });
});

app.listen(3000, () => {
  console.log("Server đang chạy trên cổng 3000");
});

async function checkDatabaseConnection() {
    try {
        await pool.query('SELECT 1'); // Kiểm tra kết nối bằng một truy vấn đơn giản
        console.log('✅ Connected to MySQL database');
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
    }
}

app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    await checkDatabaseConnection(); // Kiểm tra kết nối DB khi server khởi động
});
