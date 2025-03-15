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
    const { id_hocsinh, ten_hocsinh, tendangnhap, matkhau, email, phone } = req.body;
    if (!id_hocsinh || !ten_hocsinh || !tendangnhap || !matkhau || !email || !phone) 
        return res.status(400).json({ error: "Thiếu dữ liệu" });
    addRecord('hocsinh', ['id_hocsinh', 'ten_hocsinh', 'tendangnhap', 'matkhau', 'email', 'phone'], 
              [id_hocsinh, ten_hocsinh, tendangnhap, matkhau, email, phone], res);
});

router.post('/giaovien', (req, res) => {
    const { id_giaovien, ten_giaovien, tendangnhap_gv, matkhau_gv, email_gv, phone_gv, monchinh, lopdaychinh } = req.body;
    if (!id_giaovien || !ten_giaovien || !tendangnhap_gv || !matkhau_gv || !email_gv || !phone_gv || !lopdaychinh) 
        return res.status(400).json({ error: "Thiếu dữ liệu" });
    addRecord('giaovien', ['id_giaovien', 'ten_giaovien', 'tendangnhap_gv', 'matkhau_gv', 'email_gv', 'phone_gv', 'monchinh', 'lopdaychinh'], 
              [id_giaovien, ten_giaovien, tendangnhap_gv, matkhau_gv, email_gv, phone_gv, monchinh, lopdaychinh], res);
});

router.post('/dethi', (req, res) => {
    const { id_dethi, id_giaovien, id_monhoc, thoigianthi, trangthai } = req.body;
    if (!id_dethi || !id_giaovien || !id_monhoc || !thoigianthi || !trangthai) 
        return res.status(400).json({ error: "Thiếu dữ liệu" });
    addRecord('dethi', ['id_dethi', 'id_giaovien', 'id_monhoc', 'thoigianthi', 'trangthai'], 
              [id_dethi, id_giaovien, id_monhoc, thoigianthi, trangthai], res);
});

router.post('/baithi', (req, res) => {
    const { id_baithi, id_hocsinh, id_dethi, trangthai, diemthi } = req.body;
    if (!id_baithi || !id_hocsinh || !id_dethi || !trangthai || diemthi === undefined) 
        return res.status(400).json({ error: "Thiếu dữ liệu" });
    addRecord('baithi', ['id_baithi', 'id_hocsinh', 'id_dethi', 'trangthai', 'diemthi'], 
              [id_baithi, id_hocsinh, id_dethi, trangthai, diemthi], res);
});

router.post('/cauhoi', (req, res) => {
    const { id_cauhoi, noidungcauhoi, dapan, id_monhoc } = req.body;
    if (!id_cauhoi || !noidungcauhoi || !dapan || !id_monhoc) 
        return res.status(400).json({ error: "Thiếu dữ liệu" });
    addRecord('cauhoi', ['id_cauhoi', 'noidungcauhoi', 'dapan', 'id_monhoc'], 
              [id_cauhoi, noidungcauhoi, dapan, id_monhoc], res);
});

router.post('/cautraloi', (req, res) => {
    const { id_cautraloi, id_cauhoi, noidungcautraloi } = req.body;
    if (!id_cautraloi || !id_cauhoi || !noidungcautraloi) 
        return res.status(400).json({ error: "Thiếu dữ liệu" });
    addRecord('cautraloi', ['id_cautraloi', 'id_cauhoi', 'noidungcautraloi'], 
              [id_cautraloi, id_cauhoi, noidungcautraloi], res);
});

module.exports = router;
