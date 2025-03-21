const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('../db');
const User = require('./models/userModels');
const KeHoach = require('./models/ke_hoachModels');

const app = express();
app.use(bodyParser.json());

// Get all users
app.get('/users', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

// Get user by ID
app.get('/users/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    user ? res.json(user) : res.status(404).json({ error: 'User not found' });
});

// Create a new user
app.post('/users', async (req, res) => {
    const { name_user, user_account, pword_account } = req.body;
    try {
        const user = await User.create({ name_user, user_account, pword_account });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update user
app.put('/users/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (user) {
        await user.update(req.body);
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Delete user
app.delete('/users/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (user) {
        await user.destroy();
        res.json({ message: 'User deleted' });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Get all plans
app.get('/plans', async (req, res) => {
    const plans = await KeHoach.findAll();
    res.json(plans);
});

// Get plan by ID
app.get('/plans/:id', async (req, res) => {
    const plan = await KeHoach.findByPk(req.params.id);
    plan ? res.json(plan) : res.status(404).json({ error: 'Plan not found' });
});

// Create a new plan
app.post('/plans', async (req, res) => {
    const { name_plan, noidung, ngaygiobatdau, ngaygioketthuc, id_user } = req.body;
    try {
        const plan = await KeHoach.create({ name_plan, noidung, ngaygiobatdau, ngaygioketthuc, id_user });
        res.status(201).json(plan);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update plan
app.put('/plans/:id', async (req, res) => {
    const plan = await KeHoach.findByPk(req.params.id);
    if (plan) {
        await plan.update(req.body);
        res.json(plan);
    } else {
        res.status(404).json({ error: 'Plan not found' });
    }
});

// Delete plan
app.delete('/plans/:id', async (req, res) => {
    const plan = await KeHoach.findByPk(req.params.id);
    if (plan) {
        await plan.destroy();
        res.json({ message: 'Plan deleted' });
    } else {
        res.status(404).json({ error: 'Plan not found' });
    }
});
