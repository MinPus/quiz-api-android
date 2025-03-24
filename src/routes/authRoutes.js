const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

// Đăng ký
router.post('/register', async (req, res) => {
    const { name_user, user_account, pword_account } = req.body;
    if (!name_user || !user_account || !pword_account) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    try {
        const [existingUser] = await db.query('SELECT * FROM users WHERE user_account = ?', [user_account]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Tài khoản đã tồn tại' });
        }

        const hashedPassword = await bcrypt.hash(pword_account, 10);
        await db.query('INSERT INTO users (name_user, user_account, pword_account) VALUES (?, ?, ?)',
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
        const [user] = await db.query('SELECT * FROM users WHERE user_account = ?', [user_account]);
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
        const [users] = await db.query('SELECT id_user, name_user, user_account FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
});

// Lấy thông tin người dùng theo ID
router.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [user] = await db.query('SELECT id_user, name_user, user_account FROM users WHERE id_user = ?', [id]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }
        res.json(user[0]);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
});

module.exports = router;
