const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('../db');
const User = require('../models/userModels');
const Ke_hoach = require('../models/ke_hoachModels'); 

const app = express();
app.use(bodyParser.json());

// Get all User
app.get('/User', async (req, res) => {
    const User = await User.findAll();
    res.json(User);
});

// Get user by ID
app.get('/User/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    user ? res.json(user) : res.status(404).json({ error: 'User not found' });
});

// Create a new user
app.post('/User', async (req, res) => {
    const { name_user, user_account, pword_account } = req.body;
    try {
        const user = await User.create({ name_user, user_account, pword_account });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update user
app.put('/User/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (user) {
        await user.update(req.body);
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Delete user
app.delete('/User/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (user) {
        await user.destroy();
        res.json({ message: 'User deleted' });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Get all Ke_hoach
app.get('/Ke_hoach', async (req, res) => {
    const Ke_hoach = await KeHoach.findAll();
    res.json(Ke_hoach);
});

// Get plan by ID
app.get('/Ke_hoach/:id', async (req, res) => {
    const plan = await KeHoach.findByPk(req.params.id);
    plan ? res.json(plan) : res.status(404).json({ error: 'Plan not found' });
});

// Create a new plan
app.post('/Ke_hoach', async (req, res) => {
    const { name_plan, noidung, ngaygiobatdau, ngaygioketthuc, id_user } = req.body;
    try {
        const plan = await KeHoach.create({ name_plan, noidung, ngaygiobatdau, ngaygioketthuc, id_user });
        res.status(201).json(plan);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update plan
app.put('/Ke_hoach/:id', async (req, res) => {
    const plan = await KeHoach.findByPk(req.params.id);
    if (plan) {
        await plan.update(req.body);
        res.json(plan);
    } else {
        res.status(404).json({ error: 'Plan not found' });
    }
});

// Delete plan
app.delete('/Ke_hoach/:id', async (req, res) => {
    const plan = await KeHoach.findByPk(req.params.id);
    if (plan) {
        await plan.destroy();
        res.json({ message: 'Plan deleted' });
    } else {
        res.status(404).json({ error: 'Plan not found' });
    }
});
