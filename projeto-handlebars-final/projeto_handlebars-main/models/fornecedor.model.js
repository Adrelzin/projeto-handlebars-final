const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Fornecedor = db.define('Fornecedor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cnpj: {
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
    endereco: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'fornecedores',
    timestamps: true
});

module.exports = Fornecedor;