const express = require("express");
const routes = express.Router();
const db = require("../db"); // Import kết nối MySQL từ db.js

// Lấy danh sách giáo viên
routes.get("/giaovien", (req, res) => {
    db.query("SELECT * FROM giaovien", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Thêm giáo viên mới
routes.post("/giaovien", (req, res) => {
    const { id_giaovien, ten_giaovien, tendangnhap_gv, matkhau_gv, email_gv, phone_gv, monchinh, lopdaychinh } = req.body;
    if (!id_giaovien || !ten_giaovien || !tendangnhap_gv || !matkhau_gv || !email_gv || !phone_gv || !lopdaychinh) {
        return res.status(400).json({ error: "Thiếu dữ liệu!" });
    }
    
    const sql = "INSERT INTO giaovien (id_giaovien, ten_giaovien, tendangnhap_gv, matkhau_gv, email_gv, phone_gv, monchinh, lopdaychinh) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [id_giaovien, ten_giaovien, tendangnhap_gv, matkhau_gv, email_gv, phone_gv, monchinh, lopdaychinh], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Thêm giáo viên thành công!", data: result });
    });
});

// Lấy danh sách học sinh
routes.get("/hocsinh", (req, res) => {
    db.query("SELECT * FROM hocsinh", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Thêm học sinh mới
routes.post("/hocsinh", (req, res) => {
    const { id_hocsinh, ten_hocsinh, tendangnhap, matkhau, email, phone } = req.body;
    if (!id_hocsinh || !ten_hocsinh || !tendangnhap || !matkhau || !email || !phone) {
        return res.status(400).json({ error: "Thiếu dữ liệu!" });
    }
    
    const sql = "INSERT INTO hocsinh (id_hocsinh, ten_hocsinh, tendangnhap, matkhau, email, phone) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [id_hocsinh, ten_hocsinh, tendangnhap, matkhau, email, phone], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Thêm học sinh thành công!", data: result });
    });
});

// Lấy danh sách môn học
routes.get("/monhoc", (req, res) => {
    db.query("SELECT * FROM monhoc", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Thêm môn học mới
routes.post("/monhoc", (req, res) => {
    const { id_monhoc, tenmonhoc } = req.body;
    if (!id_monhoc || !tenmonhoc) {
        return res.status(400).json({ error: "Thiếu dữ liệu!" });
    }
    
    const sql = "INSERT INTO monhoc (id_monhoc, tenmonhoc) VALUES (?, ?)";
    db.query(sql, [id_monhoc, tenmonhoc], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Thêm môn học thành công!", data: result });
    });
});

// Lấy danh sách bài thi
routes.get("/baithi", (req, res) => {
    db.query("SELECT * FROM baithi", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Thêm bài thi mới
routes.post("/baithi", (req, res) => {
    const { id_baithi, id_hocsinh, id_dethi, trangthai, diemthi } = req.body;
    if (!id_baithi || !id_hocsinh || !id_dethi || !trangthai || diemthi === undefined) {
        return res.status(400).json({ error: "Thiếu dữ liệu!" });
    }
    
    const sql = "INSERT INTO baithi (id_baithi, id_hocsinh, id_dethi, trangthai, diemthi) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [id_baithi, id_hocsinh, id_dethi, trangthai, diemthi], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Thêm bài thi thành công!", data: result });
    });
});

module.exports = routes;
