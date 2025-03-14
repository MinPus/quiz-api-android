const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');

// Lấy danh sách giáo viên
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM giaovien');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
