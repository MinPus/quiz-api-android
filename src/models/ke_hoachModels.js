// models/ke_hoachModels.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('../userModels');

const KeHoach = sequelize.define('KeHoach', {
    id_plan: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name_plan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    noidung: {
        type: DataTypes.TEXT
    },
    ngaygiobatdau: {
        type: DataTypes.DATE,
        allowNull: false
    },
    ngaygioketthuc: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_user: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id_user'
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'ke_hoach',
    timestamps: false
});

User.hasMany(KeHoach, { foreignKey: 'id_user' });
KeHoach.belongsTo(User, { foreignKey: 'id_user' });

module.exports = KeHoach;