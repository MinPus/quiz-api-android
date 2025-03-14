const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db"); // Kết nối database
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Khóa bí mật JWT

// Đăng ký tài khoản giáo viên
router.post("/register/giaovien", async (req, res) => {
    try {
        const { id_giaovien, ten_giaovien, tendangnhap_gv, matkhau_gv, email_gv, phone_gv, monchinh, lopdaychinh } = req.body;
        if (!id_giaovien || !ten_giaovien || !tendangnhap_gv || !matkhau_gv || !email_gv || !phone_gv || !lopdaychinh) {
            return res.status(400).json({ error: "Thiếu dữ liệu!" });
        }

        const hashedPassword = await bcrypt.hash(matkhau_gv, 10); // Mã hóa mật khẩu
        const sql = "INSERT INTO giaovien (id_giaovien, ten_giaovien, tendangnhap_gv, matkhau_gv, email_gv, phone_gv, monchinh, lopdaychinh) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await db.promise().query(sql, [id_giaovien, ten_giaovien, tendangnhap_gv, hashedPassword, email_gv, phone_gv, monchinh, lopdaychinh]);
        
        res.json({ message: "Đăng ký giáo viên thành công!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Đăng ký tài khoản học sinh
router.post("/register/hocsinh", async (req, res) => {
    try {
        const { id_hocsinh, ten_hocsinh, tendangnhap, matkhau, email, phone } = req.body;
        if (!id_hocsinh || !ten_hocsinh || !tendangnhap || !matkhau || !email || !phone) {
            return res.status(400).json({ error: "Thiếu dữ liệu!" });
        }

        const hashedPassword = await bcrypt.hash(matkhau, 10);
        const sql = "INSERT INTO hocsinh (id_hocsinh, ten_hocsinh, tendangnhap, matkhau, email, phone) VALUES (?, ?, ?, ?, ?, ?)";
        await db.promise().query(sql, [id_hocsinh, ten_hocsinh, tendangnhap, hashedPassword, email, phone]);

        res.json({ message: "Đăng ký học sinh thành công!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Đăng nhập (hỗ trợ cả giáo viên & học sinh)
router.post("/login", async (req, res) => {
    try {
        const { tendangnhap, matkhau } = req.body;
        if (!tendangnhap || !matkhau) {
            return res.status(400).json({ error: "Thiếu dữ liệu đăng nhập!" });
        }

        let user;
        let role;

        // Kiểm tra tài khoản trong bảng giáo viên
        let [rows] = await db.promise().query("SELECT * FROM giaovien WHERE tendangnhap_gv = ?", [tendangnhap]);
        if (rows.length > 0) {
            user = rows[0];
            role = "giaovien";
        }

        // Nếu không tìm thấy, kiểm tra trong bảng học sinh
        if (!user) {
            [rows] = await db.promise().query("SELECT * FROM hocsinh WHERE tendangnhap = ?", [tendangnhap]);
            if (rows.length > 0) {
                user = rows[0];
                role = "hocsinh";
            }
        }

        if (!user) {
            return res.status(401).
