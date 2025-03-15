const express = require('express');
const router = express.Router();
const db = require('../db');

// Hàm lấy toàn bộ dữ liệu từ bảng bất kỳ
const getAll = async (table, res) => {
    try {
        const [rows] = await db.execute(`SELECT * FROM ${table}`);
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

// Routes GET
router.get('/monhoc', (req, res) => getAll('monhoc', res));
router.get('/hocsinh', (req, res) => getAll('hocsinh', res));
router.get('/giaovien', (req, res) => getAll('giaovien', res));
router.get('/dethi', (req, res) => getAll('dethi', res));
router.get('/baithi', (req, res) => getAll('baithi', res));
router.get('/cauhoi', (req, res) => getAll('cauhoi', res));
router.get('/cautraloi', (req, res) => getAll('cautraloi', res));


// Routes POST
router.post('/monhoc', (req, res) => {
    const { id_monhoc, tenmonhoc } = req.body;
    if (!id_monhoc || !tenmonhoc) return res.status(400).json({ error: "Thiếu dữ liệu" });
    addRecord('monhoc', ['id_monhoc', 'tenmonhoc'], [id_monhoc, tenmonhoc], res);
});
router.post('/hocsinh', (req, res) => {
    const { id_hocsinh, ten_hocsinh, lop } = req.body;
    if (!id_hocsinh || !tenhocsinh) return res.status(400).json({ error: "Thiếu dữ liệu" });
    addRecord('hocsinh', ['id_hocsinh', 'tenhocsinh'], [id_hocsinh, tenhocsinh], res);
});

router.post('/giaovien', (req, res) => {
    const { id_giaovien, tengiaovien, monhoc } = req.body;
    if (!id_giaovien || !tengiaovien || !monhoc) return res.status(400).json({ error: "Thiếu dữ liệu" });
    addRecord('giaovien', ['id_giaovien', 'tengiaovien', 'monhoc'], [id_giaovien, tengiaovien, monhoc], res);
});

router.post('/dethi', (req, res) => {
    const { id_dethi, ten_dethi } = req.body;
    if (!id_dethi || !ten_dethi) return res.status(400).json({ error: "Thiếu dữ liệu" });
    addRecord('dethi', ['id_dethi', 'ten_dethi'], [id_dethi, ten_dethi], res);
});

router.post('/baithi', (req, res) => {
    const { id_baithi, id_hocsinh, diem } = req.body;
    if (!id_baithi || !id_hocsinh || diem === undefined) return res.status(400).json({ error: "Thiếu dữ liệu" });
    addRecord('baithi', ['id_baithi', 'id_hocsinh', 'diem'], [id_baithi, id_hocsinh, diem], res);
});

router.post('/cauhoi', (req, res) => {
    const { id_cauhoi, noidung, id_dethi } = req.body;
    if (!id_cauhoi || !noidung || !id_dethi) return res.status(400).json({ error: "Thiếu dữ liệu" });
    addRecord('cauhoi', ['id_cauhoi', 'noidung', 'id_dethi'], [id_cauhoi, noidung, id_dethi], res);
});

router.post('/cautraloi', (req, res) => {
    const { id_cautraloi, id_cauhoi, noidung, dung } = req.body;
    if (!id_cautraloi || !id_cauhoi || !noidung || dung === undefined) return res.status(400).json({ error: "Thiếu dữ liệu" });
    addRecord('cautraloi', ['id_cautraloi', 'id_cauhoi', 'noidung', 'dung'], [id_cautraloi, id_cauhoi, noidung, dung], res);
});

module.exports = router;
