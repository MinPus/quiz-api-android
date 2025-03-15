const { poolPromise } = require('./src/db');

async function testConnection() {
    try {
        const pool = await poolPromise;
        const [rows] = await pool.execute('SELECT 1'); // Kiểm tra kết nối
        console.log('Kết nối thành công!', rows);
    } catch (err) {
        console.error('Lỗi kết nối:', err.message);
    }
}

testConnection();