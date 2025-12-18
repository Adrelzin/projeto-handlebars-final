const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Aluno = db.define('Aluno', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    matricula: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    dataNascimento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    turmaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'turmas',
            key: 'id'
        }
    }
}, {
    tableName: 'alunos',
    timestamps: true
});

module.exports = Aluno;