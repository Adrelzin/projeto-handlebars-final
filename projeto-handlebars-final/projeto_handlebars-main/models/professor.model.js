const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Professor = db.define('Professor', {
    professorId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    disciplina: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    }
}, {
    tableName: 'professores',
    timestamps: true
});

module.exports = Professor;