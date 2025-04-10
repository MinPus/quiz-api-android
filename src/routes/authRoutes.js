const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();
require('dotenv').config();

// Middleware để xác thực JWT
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Gắn payload đã giải mã (ví dụ: { id_user }) vào req.user
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
};

// Test API thêm user
router.post('/user', async (req, res) => {
    const { name_user, user_account, pword_account } = req.body;
    if (!name_user || !user_account || !pword_account) {
        return res.status(400).json({ message: 'Thiếu thông tin' });
    }

    try {
        const hashedPassword = await bcrypt.hash(pword_account, 10);
        await db.query('INSERT INTO user (name_user, user_account, pword_account) VALUES (?, ?, ?)',
            [name_user, user_account, hashedPassword]);

        res.status(201).json({ message: 'Thêm user thành công', user: { name_user, user_account } });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

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
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    const { user_account, pword_account } = req.body;
    if (!user_account || !pword_account) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

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
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Lấy danh sách người dùng
router.get('/user', async (req, res) => {
    try {
        const [users] = await db.query('SELECT id_user, name_user, user_account FROM user');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
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
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Cập nhật thông tin người dùng (chỉ cập nhật name_user và pword_account)
router.put('/user/:id', authenticate, async (req, res) => {
    const { id } = personally
    const { name_user, pword_account } = req.body;
    try {
        const [user] = await db.query('SELECT * FROM user WHERE id_user = ?', [id]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        if (req.user.id_user != id) {
            return res.status(403).json({ message: 'Bạn không có quyền cập nhật người dùng này' });
        }

        const updatedName = name_user || user[0].name_user;
        const updatedPassword = pword_account ? await bcrypt.hash(pword_account, 10) : user[0].pword_account;

        await db.query('UPDATE user SET name_user = ?, pword_account = ? WHERE id_user = ?',
            [updatedName, updatedPassword, id]);

        res.json({ message: 'Cập nhật người dùng thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Xóa người dùng và toàn bộ kế hoạch liên quan
router.delete('/user/:id_user', authenticate, async (req, res) => {
    const { id_user } = req.params;
    if (req.user.id_user != id_user) {
        return res.status(403).json({ message: 'Bạn không có quyền xóa người dùng này' });
    }
    try {
        await db.query('DELETE FROM ke_hoach WHERE id_user = ?', [id_user]);
        await db.query('DELETE FROM user WHERE id_user = ?', [id_user]);
        res.json({ message: 'Xóa người dùng và toàn bộ kế hoạch thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Lấy danh sách kế hoạch
router.get('/kehoach', async (req, res) => {
    try {
        const [plans] = await db.query('SELECT * FROM ke_hoach');
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Lấy kế hoạch theo ID
router.get('/kehoach/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const [plan] = await db.query('SELECT * FROM ke_hoach WHERE id_plan = ? AND id_user = ?', [id, req.user.id_user]);
        if (plan.length === 0) {
            return res.status(404).json({ message: 'Kế hoạch không tồn tại' });
        }
        res.json(plan[0]);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Lấy danh sách kế hoạch theo ID người dùng
router.get('/kehoach/user/:id_user', authenticate, async (req, res) => {
    const { id_user } = req.params;
    if (req.user.id_user != id_user) {
        return res.status(403).json({ message: 'Bạn không có quyền xem kế hoạch của người dùng này' });
    }
    try {
        const [plans] = await db.query('SELECT * FROM ke_hoach WHERE id_user = ?', [id_user]);
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Thêm kế hoạch
router.post('/kehoach', authenticate, async (req, res) => {
    const { name_plan, noidung, ngaygiobatdau, ngaygioketthuc, id_user } = req.body;
    if (!name_plan || !noidung || !ngaygiobatdau || !ngaygioketthuc || !id_user) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    if (req.user.id_user != id_user) {
        return res.status(403).json({ message: 'Bạn không có quyền thêm kế hoạch cho người dùng này' });
    }

    try {
        await db.query('INSERT INTO ke_hoach (name_plan, noidung, ngaygiobatdau, ngaygioketthuc, id_user) VALUES (?, ?, ?, ?, ?)',
            [name_plan, noidung, ngaygiobatdau, ngaygioketthuc, id_user]);
        res.status(201).json({ message: 'Thêm kế hoạch thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Thêm kế hoạch theo ID người dùng
router.post('/kehoach/user/:id_user', authenticate, async (req, res) => {
    const { id_user } = req.params;
    const { name_plan, noidung, ngaygiobatdau, ngaygioketthuc } = req.body;
    if (!name_plan || !noidung || !ngaygiobatdau || !ngaygioketthuc) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    if (req.user.id_user != id_user) {
        return res.status(403).json({ message: 'Bạn không có quyền thêm kế hoạch cho người dùng này' });
    }

    try {
        await db.query('INSERT INTO ke_hoach (name_plan, noidung, ngaygiobatdau, ngaygioketthuc, id_user) VALUES (?, ?, ?, ?, ?)',
            [name_plan, noidung, ngaygiobatdau, ngaygioketthuc, id_user]);
        res.status(201).json({ message: 'Thêm kế hoạch thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Cập nhật kế hoạch theo ID
router.put('/kehoach/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { name_plan, noidung, ngaygiobatdau, ngaygioketthuc } = req.body;
    try {
        const [plan] = await db.query('SELECT * FROM ke_hoach WHERE id_plan = ? AND id_user = ?', [id, req.user.id_user]);
        if (plan.length === 0) {
            return res.status(404).json({ message: 'Kế hoạch không tồn tại' });
        }

        await db.query('UPDATE ke_hoach SET name_plan = ?, noidung = ?, ngaygiobatdau = ?, ngaygioketthuc = ? WHERE id_plan = ? AND id_user = ?',
            [name_plan || plan[0].name_plan, noidung || plan[0].noidung, ngaygiobatdau || plan[0].ngaygiobatdau, ngaygioketthuc || plan[0].ngaygioketthuc, id, req.user.id_user]);
        
        res.json({ message: 'Cập nhật kế hoạch thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Xóa kế hoạch
router.delete('/kehoach/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const [plan] = await db.query('SELECT * FROM ke_hoach WHERE id_plan = ? AND id_user = ?', [id, req.user.id_user]);
        if (plan.length === 0) {
            return res.status(404).json({ message: 'Kế hoạch không tồn tại' });
        }

        await db.query('DELETE FROM ke_hoach WHERE id_plan = ? AND id_user = ?', [id, req.user.id_user]);
        res.json({ message: 'Xóa kế hoạch thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = router;
