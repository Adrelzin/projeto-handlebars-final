const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Responsavel = db.define('Responsavel', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    parentesco: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alunoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'alunos',
            key: 'id'
        }
    }
}, {
    tableName: 'responsaveis',
    timestamps: true
});

module.exports = Responsavel;