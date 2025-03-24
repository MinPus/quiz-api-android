const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();
require('dotenv').config();

// Đăng ký
router.post('/register', async (req, res) => {
    const { name_user, user_account, pword_account } = req.body;
    if (!name_user || !user_account || !pword_account) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    try {
        const [existingUser] = await db.query('SELECT * FROM user WHERE user_account = ?', [user_account]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Tài khoản đã tồn tại' });
        }

        const hashedPassword = await bcrypt.hash(pword_account, 10);
        await db.query('INSERT INTO user (name_user, user_account, pword_account) VALUES (?, ?, ?)',
            [name_user, user_account, hashedPassword]);

        res.status(201).json({ message: 'Đăng ký thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    const { user_account, pword_account } = req.body;
    try {
        const [user] = await db.query('SELECT * FROM user WHERE user_account = ?', [user_account]);
        if (user.length === 0) {
            return res.status(400).json({ message: 'Tài khoản không tồn tại' });
        }

        const isMatch = await bcrypt.compare(pword_account, user[0].pword_account);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu không đúng' });
        }

        const token = jwt.sign({ id_user: user[0].id_user }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Đăng nhập thành công', token });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
});

// Lấy danh sách người dùng
router.get('/user', async (req, res) => {
    try {
        const [user] = await db.query('SELECT id_user, name_user, user_account FROM user');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
});

// Lấy thông tin người dùng theo ID
router.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [user] = await db.query('SELECT id_user, name_user, user_account FROM user WHERE id_user = ?', [id]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }
        res.json(user[0]);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
});

// Cập nhật thông tin người dùng (chỉ cập nhật name_user và pword_account)
router.put('/user/:id', async (req, res) => {
    const { id } = req.params;
    const { name_user, pword_account } = req.body;
    try {
        const [user] = await db.query('SELECT * FROM user WHERE id_user = ?', [id]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        const updatedName = name_user || user[0].name_user;
        const updatedPassword = pword_account ? await bcrypt.hash(pword_account, 10) : user[0].pword_account;

        await db.query('UPDATE user SET name_user = ?, pword_account = ? WHERE id_user = ?',
            [updatedName, updatedPassword, id]);

        res.json({ message: 'Cập nhật người dùng thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
});

// Xóa người dùng và toàn bộ kế hoạch liên quan
router.delete('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM ke_hoach WHERE id_user = ?', [id]);
        await db.query('DELETE FROM user WHERE id_user = ?', [id]);
        res.json({ message: 'Xóa người dùng và toàn bộ kế hoạch liên quan thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
});

// Lấy danh sách kế hoạch
router.get('/kehoach', async (req, res) => {
    try {
        const [plans] = await db.query('SELECT * FROM ke_hoach');
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
});

// Thêm kế hoạch
router.post('/kehoach', async (req, res) => {
    const { name_plan, noidung, ngaygiobatdau, ngaygioketthuc, id_user } = req.body;
    if (!name_plan || !noidung || !ngaygiobatdau || !ngaygioketthuc || !id_user) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    try {
        await db.query('INSERT INTO ke_hoach (name_plan, noidung, ngaygiobatdau, ngaygioketthuc, id_user) VALUES (?, ?, ?, ?, ?)',
            [name_plan, noidung, ngaygiobatdau, ngaygioketthuc, id_user]);
        res.status(201).json({ message: 'Thêm kế hoạch thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
});

module.exports = router;
