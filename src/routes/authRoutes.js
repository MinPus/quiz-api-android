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
// Hàm xóa dữ liệu từ bảng bất kỳ
const deleteRecord = async (table, idField, idValue, res) => {
    try {
        await db.execute(`DELETE FROM ${table} WHERE ${idField} = ?`, [idValue]);
        res.json({ message: `Xóa khỏi ${table} thành công` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Hàm cập nhật dữ liệu trong bảng bất kỳ
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

// Routes DELETE
router.delete('/:table/:id', (req, res) => {
    const { table, id } = req.params;
    const idField = `id_${table}`;
    deleteRecord(table, idField, id, res);
});

// Routes PUT
router.put('/:table/:id', (req, res) => {
    const { table, id } = req.params;
    const updates = req.body;
    if (Object.keys(updates).length === 0) return res.status(400).json({ error: "Không có dữ liệu để cập nhật" });
    const idField = `id_${table}`;
    updateRecord(table, idField, id, updates, res);
});

module.exports = router;
