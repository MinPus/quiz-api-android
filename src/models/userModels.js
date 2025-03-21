// models/userModels.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
    id_user: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name_user: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_account: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    pword_account: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'user',
    timestamps: false
});

module.exports = User;