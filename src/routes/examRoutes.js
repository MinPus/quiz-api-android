const express = require('express');
const routes = express.Routes();
const { poolPromise, sql } = require('../db');

// Lấy danh sách đề thi
routes.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM dethi');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
