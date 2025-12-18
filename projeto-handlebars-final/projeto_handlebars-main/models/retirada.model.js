const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Retirada = db.define('Retirada', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    alunoId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'alunos',
            key: 'id'
        },
        validate: {
            alunoOuProfessor() {
                if (!this.alunoId && !this.professorId) {
                    throw new Error('É necessário selecionar um aluno ou professor');
                }
            }
        }
    },
    professorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'professores',
            key: 'professorId'
        },
        validate: {
            alunoOuProfessor() {
                if (!this.alunoId && !this.professorId) {
                    throw new Error('É necessário selecionar um aluno ou professor');
                }
            }
        }
    },
    materialId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'materiais',
            key: 'id'
        }
    },
    servidorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'servidores',
            key: 'id'
        }
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dataRetirada: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    horaRetirada: {
        type: DataTypes.TIME,
        allowNull: false
    },
    finalidade: {
        type: DataTypes.STRING,
        allowNull: false
    },
    observacoes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'retiradas',
    timestamps: true
});

module.exports = Retirada;