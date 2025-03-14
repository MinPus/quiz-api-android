// File: src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Lấy danh sách giáo viên
router.get("/giaovien", async (req, res) => {
    try {
        const [results] = await pool.query("SELECT * FROM giaovien");
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Thêm giáo viên mới
router.post("/giaovien", async (req, res) => {
    const { id_giaovien, ten_giaovien, tendangnhap_gv, matkhau_gv, email_gv, phone_gv, monchinh, lopdaychinh } = req.body;
    if (!id_giaovien || !ten_giaovien || !tendangnhap_gv || !matkhau_gv || !email_gv || !phone_gv || !lopdaychinh) {
        return res.status(400).json({ error: "Thiếu dữ liệu!" });
    }

    try {
        const [result] = await pool.query(
            "INSERT INTO giaovien (id_giaovien, ten_giaovien, tendangnhap_gv, matkhau_gv, email_gv, phone_gv, monchinh, lopdaychinh) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [id_giaovien, ten_giaovien, tendangnhap_gv, matkhau_gv, email_gv, phone_gv, monchinh, lopdaychinh]
        );
        res.json({ message: "Thêm giáo viên thành công!", data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lấy danh sách học sinh
router.get("/hocsinh", async (req, res) => {
    try {
        const [results] = await pool.query("SELECT * FROM hocsinh");
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Thêm học sinh mới
router.post("/hocsinh", async (req, res) => {
    const { id_hocsinh, ten_hocsinh, tendangnhap, matkhau, email, phone } = req.body;
    if (!id_hocsinh || !ten_hocsinh || !tendangnhap || !matkhau || !email || !phone) {
        return res.status(400).json({ error: "Thiếu dữ liệu!" });
    }

    try {
        const [result] = await pool.query(
            "INSERT INTO hocsinh (id_hocsinh, ten_hocsinh, tendangnhap, matkhau, email, phone) VALUES (?, ?, ?, ?, ?, ?)",
            [id_hocsinh, ten_hocsinh, tendangnhap, matkhau, email, phone]
        );
        res.json({ message: "Thêm học sinh thành công!", data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lấy danh sách môn học
router.get("/monhoc", async (req, res) => {
    try {
        const [results] = await pool.query("SELECT * FROM monhoc");
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Thêm môn học mới
router.post("/monhoc", async (req, res) => {
    const { id_monhoc, tenmonhoc } = req.body;
    if (!id_monhoc || !tenmonhoc) {
        return res.status(400).json({ error: "Thiếu dữ liệu!" });
    }

    try {
        const [result] = await pool.query("INSERT INTO monhoc (id_monhoc, tenmonhoc) VALUES (?, ?)", [id_monhoc, tenmonhoc]);
        res.json({ message: "Thêm môn học thành công!", data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lấy danh sách bài thi
router.get("/baithi", async (req, res) => {
    try {
        const [results] = await pool.query("SELECT * FROM baithi");
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Thêm bài thi mới
router.post("/baithi", async (req, res) => {
    const { id_baithi, id_hocsinh, id_dethi, trangthai, diemthi } = req.body;
    if (!id_baithi || !id_hocsinh || !id_dethi || !trangthai || diemthi === undefined) {
        return res.status(400).json({ error: "Thiếu dữ liệu!" });
    }

    try {
        const [result] = await pool.query(
            "INSERT INTO baithi (id_baithi, id_hocsinh, id_dethi, trangthai, diemthi) VALUES (?, ?, ?, ?, ?)",
            [id_baithi, id_hocsinh, id_dethi, trangthai, diemthi]
        );
        res.json({ message: "Thêm bài thi thành công!", data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
