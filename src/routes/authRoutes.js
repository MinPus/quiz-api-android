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
        const decoded = jwt.send(token, process.env.JWT_SECRET);
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

const nodemailer = require('nodemailer');

// Cấu hình Nodemailer (sử dụng Gmail làm ví dụ, bạn có thể thay bằng dịch vụ email khác)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Thêm email của bạn vào .env
        pass: process.env.EMAIL_PASS, // Thêm app password của bạn vào .env (nếu dùng Gmail, cần tạo app password)
    },
});

// Biến tạm để lưu OTP (trong thực tế, nên dùng database với thời gian hết hạn)
let storedOtps = {};

// Hàm tạo mã OTP ngẫu nhiên (6 chữ số)
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// API gửi OTP
router.post('/api/send-otp', async (req, res) => {
    const { user_account } = req.body;

    if (!user_account) {
        return res.status(400).json({ message: 'Vui lòng cung cấp email' });
    }

    try {
        // Kiểm tra xem user_account có tồn tại trong DB không
        const [existingUser] = await db.query('SELECT * FROM user WHERE user_account = ?', [user_account]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Tài khoản đã tồn tại, không cần gửi OTP' });
        }

        // Tạo mã OTP
        const otp = generateOtp();

        // Lưu OTP tạm thời (nên thay bằng Redis hoặc DB với TTL)
        storedOtps[user_account] = otp;

        // Cấu hình email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user_account,
            subject: 'Mã OTP Xác Minh Tài Khoản',
            text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 5 phút.`,
        };

        // Gửi email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP đã được gửi thành công tới email của bạn' });
    } catch (error) {
        console.error('Lỗi khi gửi OTP:', error);
        res.status(500).json({ message: 'Lỗi server khi gửi OTP', error: error.message });
    }
});

// API xác minh OTP (để dùng với /api/send-otp trong Flutter)
router.post('/api/send-otp', async (req, res) => {
    const { user_account, otp } = req.body;

    if (!user_account || !otp) {
        return res.status(400).json({ message: 'Vui lòng cung cấp email và mã OTP' });
    }

    try {
        // Kiểm tra OTP
        if (storedOtps[user_account] && storedOtps[user_account] === otp) {
            // Xóa OTP sau khi xác minh thành công (tránh tái sử dụng)
            delete storedOtps[user_account];
            res.status(200).json({ message: 'Xác minh OTP thành công' });
        } else {
            res.status(400).json({ message: 'Mã OTP không đúng hoặc đã hết hạn' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xác minh OTP', error: error.message });
    }
});
module.exports = router;
