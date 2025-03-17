const express = require('express');
const router = express.Router();
const db = require('../db');

// Hàm lấy toàn bộ dữ liệu từ bảng bất kỳ và thay ID bằng object liên quan
const getAll = async (table, res) => {
    try {
        let query = `SELECT * FROM ${table}`;
        if (table === 'baithi') {
            query = `SELECT baithi.*, JSON_OBJECT('id_hocsinh', hocsinh.id_hocsinh, 'ten_hocsinh', hocsinh.ten_hocsinh) AS hocsinh,
                            JSON_OBJECT('id_dethi', dethi.id_dethi, 'thoigianthi', dethi.thoigianthi) AS dethi 
                     FROM baithi 
                     JOIN hocsinh ON baithi.id_hocsinh = hocsinh.id_hocsinh 
                     JOIN dethi ON baithi.id_dethi = dethi.id_dethi`;
        } else if (table === 'dethi') {
            query = `SELECT dethi.*, JSON_OBJECT('id_giaovien', giaovien.id_giaovien, 'ten_giaovien', giaovien.ten_giaovien) AS giaovien,
                            JSON_OBJECT('id_monhoc', monhoc.id_monhoc, 'tenmonhoc', monhoc.tenmonhoc) AS monhoc 
                     FROM dethi 
                     JOIN giaovien ON dethi.id_giaovien = giaovien.id_giaovien 
                     JOIN monhoc ON dethi.id_monhoc = monhoc.id_monhoc`;
        } else if (table === 'cauhoi') {
            query = `SELECT cauhoi.*, JSON_OBJECT('id_monhoc', monhoc.id_monhoc, 'tenmonhoc', monhoc.tenmonhoc) AS monhoc 
                     FROM cauhoi 
                     JOIN monhoc ON cauhoi.id_monhoc = monhoc.id_monhoc`;
        } else if (table === 'cautraloi') {
            query = `SELECT cautraloi.*, JSON_OBJECT('id_cauhoi', cauhoi.id_cauhoi, 'noidungcauhoi', cauhoi.noidungcauhoi) AS cauhoi 
                     FROM cautraloi 
                     JOIN cauhoi ON cautraloi.id_cauhoi = cauhoi.id_cauhoi`;
        } else if (table === 'giaovien') {
            query = `SELECT giaovien.*, JSON_OBJECT('id_monhoc', monhoc.id_monhoc, 'tenmonhoc', monhoc.tenmonhoc) AS monchinh 
                     FROM giaovien 
                     JOIN monhoc ON giaovien.monchinh = monhoc.id_monhoc`;
        }
        
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Hàm thêm dữ liệu vào bảng bất kỳ
const addRecord = async (table, fields, values, res) => {
    try {
        const placeholders = values.map(() => '?').join(', ');
        await db.execute(`INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders})`, values);
        res.status(201).json({ message: `Thêm vào ${table} thành công` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Hàm cập nhật dữ liệu
const updateRecord = async (table, idField, idValue, updates, res) => {
    try {
        const fields = Object.keys(updates).map(field => `${field} = ?`).join(', ');
        const values = Object.values(updates);
        values.push(idValue);
        await db.execute(`UPDATE ${table} SET ${fields} WHERE ${idField} = ?`, values);
        res.json({ message: `Cập nhật ${table} thành công` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Hàm xóa dữ liệu
const deleteRecord = async (table, idField, idValue, res) => {
    try {
        await db.execute(`DELETE FROM ${table} WHERE ${idField} = ?`, [idValue]);
        res.json({ message: `Xóa khỏi ${table} thành công` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Routes
router.get('/:table', (req, res) => getAll(req.params.table, res));
router.post('/:table', (req, res) => {
    const { table } = req.params;
    const fields = Object.keys(req.body);
    const values = Object.values(req.body);
    addRecord(table, fields, values, res);
});
router.put('/:table/:id', (req, res) => updateRecord(req.params.table, `id_${req.params.table}`, req.params.id, req.body, res));
router.delete('/:table/:id', (req, res) => deleteRecord(req.params.table, `id_${req.params.table}`, req.params.id, res));

module.exports = router;
