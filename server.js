const express = require('express');
const dotenv = require('dotenv');
const pool = require('./src/db'); // Import kết nối MySQL
const authRoutes = require('./src/routes/authRoutes');

dotenv.config();
const app = express();
app.use(express.json());
app.use('/api', authRoutes);

const PORT = process.env.PORT || 3000;

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
