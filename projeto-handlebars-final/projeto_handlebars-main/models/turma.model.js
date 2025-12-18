const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Turma = db.define('Turma', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    turno: {
        type: DataTypes.STRING,
        allowNull: false
    },
    capacidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30
    }
}, {
    tableName: 'turmas',
    timestamps: true
});

module.exports = Turma;