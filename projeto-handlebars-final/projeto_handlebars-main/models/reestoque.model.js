const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Reestoque = db.define('Reestoque', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    materialId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'materiais',
            key: 'id'
        }
    },
    fornecedorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'fornecedores',
            key: 'id'
        }
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    valorUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    valorTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    dataReestoque: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    notaFiscal: {
        type: DataTypes.STRING,
        allowNull: true
    },
    observacoes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'reestoques',
    timestamps: true
});

module.exports = Reestoque;