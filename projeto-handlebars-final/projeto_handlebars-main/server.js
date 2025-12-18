const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser');
const db = require('./config/database');
const port = 3000;

const Material = require('./models/material.model');
const Professor = require('./models/professor.model');
const Turma = require('./models/turma.model');
const Aluno = require('./models/aluno.model');
const Servidor = require('./models/servidor.model');
const Retirada = require('./models/retirada.model');
const Responsavel = require('./models/responsavel.model');
const Fornecedor = require('./models/fornecedor.model');
const Reestoque = require('./models/reestoque.model');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.engine('handlebars', exphbs.engine({
    defaultLayout: false,
    helpers: {
        eq: function (a, b) {
            return a === b;
        }
    }
}));

app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: true }));

// 1xN (Um para Muitos)
Aluno.belongsTo(Turma, { foreignKey: 'turmaId', as: 'Turma', onDelete: 'SET NULL' });
Turma.hasMany(Aluno, { foreignKey: 'turmaId', as: 'Alunos' });

Aluno.hasMany(Retirada, { foreignKey: 'alunoId', as: 'Retiradas' });
Retirada.belongsTo(Aluno, { foreignKey: 'alunoId', as: 'Aluno', onDelete: 'CASCADE' });

Material.hasMany(Retirada, { foreignKey: 'materialId', as: 'Retiradas' });
Retirada.belongsTo(Material, { foreignKey: 'materialId', as: 'Material', onDelete: 'CASCADE' });

Professor.hasMany(Retirada, { foreignKey: 'professorId', sourceKey: 'professorId', as: 'Retiradas' });
Retirada.belongsTo(Professor, { foreignKey: 'professorId', targetKey: 'professorId', as: 'Professor', onDelete: 'CASCADE' });

Servidor.hasMany(Retirada, { foreignKey: 'servidorId', as: 'Retiradas' });
Retirada.belongsTo(Servidor, { foreignKey: 'servidorId', as: 'Servidor' });

Material.hasMany(Reestoque, { foreignKey: 'materialId', as: 'Reestoques' });
Reestoque.belongsTo(Material, { foreignKey: 'materialId', as: 'Material' });

Fornecedor.hasMany(Reestoque, { foreignKey: 'fornecedorId', as: 'Reestoques' });
Reestoque.belongsTo(Fornecedor, { foreignKey: 'fornecedorId', as: 'Fornecedor' });

// 1x1 (Um para Um)
Aluno.hasOne(Responsavel, { foreignKey: 'alunoId', as: 'Responsavel', onDelete: 'CASCADE' });
Responsavel.belongsTo(Aluno, { foreignKey: 'alunoId', as: 'Aluno', onDelete: 'CASCADE' });

// NxN (Muitos para Muitos)
Turma.belongsToMany(Material, { through: 'TurmaMaterial', as: 'Materiais', foreignKey: 'turmaId' });
Material.belongsToMany(Turma, { through: 'TurmaMaterial', as: 'Turmas', foreignKey: 'materialId' });

Material.belongsToMany(Fornecedor, { through: Reestoque, foreignKey: 'materialId', otherKey: 'fornecedorId', as: 'Fornecedores' });
Fornecedor.belongsToMany(Material, { through: Reestoque, foreignKey: 'fornecedorId', otherKey: 'materialId', as: 'Materiais' });

db.sync().then(async () => {
    console.log('Banco sincronizado');
    const materialCount = await Material.count();

    if (materialCount === 0) {
        console.log('Banco vazio. Inserindo dados iniciais...');
        await Material.bulkCreate([
            { nome: "Caderno 10 materias", quantidade: 50 },
            { nome: "Lapis HB", quantidade: 200 },
            { nome: "Borracha branca", quantidade: 100 },
        ]);
        await Professor.bulkCreate([
            { nome: "Eric Sales", disciplina: "Dev. Web", email: "Eric@ifpe.com" },
            { nome: "Rogerio Amaral", disciplina: "Matematica", email: "Rogerio@ifpe.com" },
            { nome: "Havana Alves", disciplina: "Programacao 1", email: "Havana@ifpe.com" },
        ]);
        await Turma.bulkCreate([
            { nome: "1 Ano A", turno: "Manha", capacidade: 30 },
            { nome: "1 Ano B", turno: "Manha", capacidade: 28 },
            { nome: "2 Ano A", turno: "Manha", capacidade: 32 },
        ]);
        await Aluno.bulkCreate([
            { nome: "Pedro Oliveira", matricula: "2024001", dataNascimento: "2010-05-15", turmaId: 1 },
            { nome: "Julia Santos", matricula: "2024002", dataNascimento: "2010-08-22", turmaId: 1 },
            { nome: "Lucas Silva", matricula: "2024003", dataNascimento: "2011-03-10", turmaId: 2 },
        ]);
        await Responsavel.bulkCreate([
            { nome: "Carlos Oliveira", cpf: "123.456.789-00", telefone: "(81) 99999-0001", email: "carlos.oliveira@email.com", parentesco: "Pai", alunoId: 1 },
            { nome: "Maria Santos", cpf: "123.456.789-01", telefone: "(81) 99999-0002", email: "maria.santos@email.com", parentesco: "Mae", alunoId: 2 },
            { nome: "Ana Silva", cpf: "123.456.789-02", telefone: "(81) 99999-0003", email: "ana.silva@email.com", parentesco: "Mae", alunoId: 3 },
        ]);
        await Servidor.bulkCreate([
            { nome: "Carlos Mendes", cargo: "Secretario", setor: "Secretaria", matricula: "SRV001", telefone: "(81) 98765-4321", email: "carlos@escola.com" },
            { nome: "Fernanda Lima", cargo: "Coordenadora", setor: "Coordenacao", matricula: "SRV002", telefone: "(81) 98765-4322", email: "fernanda@escola.com" },
        ]);
        await Retirada.bulkCreate([
            { alunoId: 1, materialId: 1, quantidade: 2, dataRetirada: "2024-11-01", horaRetirada: "08:30:00", servidorId: 1, finalidade: "Aula de Matematica" },
            { alunoId: 2, materialId: 2, quantidade: 5, dataRetirada: "2024-11-02", horaRetirada: "09:15:00", servidorId: 2, finalidade: "Projeto de Arte" },
            { professorId: 1, materialId: 3, quantidade: 3, dataRetirada: "2024-11-03", horaRetirada: "10:00:00", servidorId: 1, finalidade: "Aula de Matematica" },
        ]);
        await Fornecedor.bulkCreate([
            { nome: "Papelaria Central", cnpj: "12.345.678/0001-90", telefone: "(81) 3333-1111", email: "contato@papelcentral.com", endereco: "Rua A, 123" },
            { nome: "Distribuidora Escolar", cnpj: "98.765.432/0001-10", telefone: "(81) 3333-2222", email: "vendas@distescolar.com", endereco: "Av. B, 456" },
            { nome: "Mega Office", cnpj: "11.222.333/0001-44", telefone: "(81) 3333-3333", email: "atendimento@megaoffice.com", endereco: "Rua C, 789" }
        ]);

        await Reestoque.bulkCreate([
            { materialId: 1, fornecedorId: 1, quantidade: 50, valorUnitario: 15.50, valorTotal: 775.00, dataReestoque: "2024-01-15", notaFiscal: "NF-001" },
            { materialId: 2, fornecedorId: 2, quantidade: 200, valorUnitario: 0.50, valorTotal: 100.00, dataReestoque: "2024-01-20", notaFiscal: "NF-002" },
            { materialId: 3, fornecedorId: 1, quantidade: 100, valorUnitario: 1.20, valorTotal: 120.00, dataReestoque: "2024-02-01", notaFiscal: "NF-003" },
            { materialId: 1, fornecedorId: 3, quantidade: 30, valorUnitario: 14.00, valorTotal: 420.00, dataReestoque: "2024-02-15", notaFiscal: "NF-004" }
        ]);
        console.log('Dados iniciais inseridos com sucesso!');
    } else {
        console.log('Banco ja contem dados. Mantendo dados existentes.');
    }
});

function crudRoutes(app, model, viewName, alias, options = {}) {
    const { 
        include = [], 
        pkField = 'id',
        singularName = alias.slice(0, -1),
        beforeDelete = null,
        beforeCreate = null,
        beforeUpdate = null
    } = options;

    app.get(`/${alias}`, async (req, res) => {
        const registros = await model.findAll({ include });
        res.render(viewName, { lista: true, [alias]: registros.map(r => r.toJSON()) });
    });

    app.get(`/${alias}/novo`, async (req, res) => {
        const extraData = {};
        if (options.fetchRelations) {
            Object.assign(extraData, await options.fetchRelations());
        }
        res.render(viewName, { form: true, ...extraData });
    });

    app.get(`/${alias}/:id/editar`, async (req, res) => {
        const registro = await model.findByPk(req.params.id);
        if (!registro) return res.status(404).send(`${alias} nao encontrado`);
        const extraData = {};
        if (options.fetchRelations) {
            Object.assign(extraData, await options.fetchRelations());
        }
        res.render(viewName, { form: true, [singularName]: registro.toJSON(), ...extraData });
    });

    app.get(`/${alias}/ver/:id`, async (req, res) => {
        const registro = await model.findByPk(req.params.id, { include });
        if (!registro) return res.status(404).send(`${alias} nao encontrado`);
        res.render(viewName, { detalhe: true, [singularName]: registro.toJSON() });
    });

    app.post(`/${alias}`, async (req, res) => {
        try {
            if (beforeCreate) await beforeCreate(req);
            await model.create(req.body);
            res.redirect(`/${alias}`);
        } catch (error) {
            console.error(`Erro ao criar ${alias}:`, error);
            res.status(500).send(`Erro ao criar ${alias}: ` + error.message);
        }
    });

    app.post(`/${alias}/:id/editar`, async (req, res) => {
        try {
            if (beforeUpdate) await beforeUpdate(req);
            await model.update(req.body, { where: { [pkField]: req.params.id } });
            res.redirect(`/${alias}`);
        } catch (error) {
            console.error(`Erro ao editar ${alias}:`, error);
            res.status(500).send(`Erro ao editar ${alias}: ` + error.message);
        }
    });

    app.post(`/${alias}/excluir/:id`, async (req, res) => {
        try {
            if (beforeDelete) await beforeDelete(req.params.id);
            await model.destroy({ where: { [pkField]: req.params.id } });
            res.redirect(`/${alias}`);
        } catch (error) {
            console.error(`Erro ao excluir ${alias}:`, error);
            res.status(500).send(`Erro ao excluir ${alias}`);
        }
    });
}

app.get('/', (req, res) => res.render('home'));

crudRoutes(app, Material, 'materiais', 'materiais', {
    singularName: 'material',
    beforeDelete: async (id) => {
        await Retirada.destroy({ where: { materialId: id } });
    }
});

crudRoutes(app, Professor, 'professores', 'professores', {
    singularName: 'professor',
    pkField: 'professorId',
    beforeDelete: async (id) => {
        await Retirada.destroy({ where: { professorId: id } });
    }
});

crudRoutes(app, Turma, 'turmas', 'turmas', {
    singularName: 'turma',
    include: [{ model: Aluno, as: 'Alunos' }]
});

crudRoutes(app, Aluno, 'alunos', 'alunos', {
    singularName: 'aluno',
    include: [{ model: Turma, as: 'Turma' }, { model: Responsavel, as: 'Responsavel' }],
    fetchRelations: async () => {
        const turmas = await Turma.findAll();
        return { turmas: turmas.map(t => t.toJSON()) };
    },
    beforeDelete: async (id) => {
        await Responsavel.destroy({ where: { alunoId: id } });
        await Retirada.destroy({ where: { alunoId: id } });
    }
});

crudRoutes(app, Responsavel, 'responsaveis', 'responsaveis', {
    singularName: 'responsavel',
    include: [{ model: Aluno, as: 'Aluno' }],
    fetchRelations: async () => {
        const alunos = await Aluno.findAll();
        return { alunos: alunos.map(a => a.toJSON()) };
    }
});

crudRoutes(app, Servidor, 'servidores', 'servidores', {
    singularName: 'servidor'
});

crudRoutes(app, Fornecedor, 'fornecedores', 'fornecedores', {
    singularName: 'fornecedor',
    include: [{ model: Reestoque, as: 'Reestoques', include: [{ model: Material, as: 'Material' }] }],
    beforeDelete: async (id) => {
        await Reestoque.destroy({ where: { fornecedorId: id } });
    }
});

app.get('/turmas/:id/materiais', async (req, res) => {
    try {
        const turma = await Turma.findByPk(req.params.id, { 
            include: [
                { model: Material, as: 'Materiais' },
                { model: Aluno, as: 'Alunos' }
            ] 
        });
        
        if (!turma) return res.status(404).send('Turma nao encontrada');
        
        const todosMateriais = await Material.findAll();
        
        const idsAlunos = turma.Alunos.map(aluno => aluno.id);
        
        const retiradas = await Retirada.findAll({
            where: { 
                alunoId: idsAlunos 
            },
            include: [
                { model: Material, as: 'Material' },
                { model: Aluno, as: 'Aluno' }
            ],
            order: [['dataRetirada', 'DESC']]
        });
        
        const materiaisRetirados = {};
        retiradas.forEach(retirada => {
            const matId = retirada.materialId;
            if (!materiaisRetirados[matId]) {
                materiaisRetirados[matId] = {
                    id: matId,
                    nome: retirada.Material.nome,
                    quantidadeTotal: 0,
                    retiradas: []
                };
            }
            materiaisRetirados[matId].quantidadeTotal += retirada.quantidade;
            materiaisRetirados[matId].retiradas.push({
                aluno: retirada.Aluno.nome,
                quantidade: retirada.quantidade,
                data: retirada.dataRetirada,
                finalidade: retirada.finalidade
            });
        });
        
        const materiaisRetiradosArray = Object.values(materiaisRetirados);
        
        res.render('turma-materiais', { 
            turma: turma.toJSON(), 
            materiais: todosMateriais.map(m => m.toJSON()),
            materiaisRetirados: materiaisRetiradosArray
        });
    } catch (error) {
        console.error('Erro ao buscar materiais da turma:', error);
        res.status(500).send('Erro ao buscar materiais da turma: ' + error.message);
    }
});

app.post('/turmas/:id/materiais/adicionar', async (req, res) => {
    const turma = await Turma.findByPk(req.params.id);
    if (turma && req.body.materialId) await turma.addMaterial(req.body.materialId);
    res.redirect(`/turmas/${req.params.id}/materiais`);
});

app.post('/turmas/:turmaId/materiais/remover/:materialId', async (req, res) => {
    const turma = await Turma.findByPk(req.params.turmaId);
    if (turma) await turma.removeMaterial(req.params.materialId);
    res.redirect(`/turmas/${req.params.turmaId}/materiais`);
});

app.get('/retiradas', async (req, res) => {
    try {
        const { busca, tipo } = req.query;
        const { Op } = require('sequelize');
        let where = {};
        let include = [
            { model: Aluno, as: 'Aluno', required: false },
            { model: Professor, as: 'Professor', required: false },
            { model: Material, as: 'Material', required: true },
            { model: Servidor, as: 'Servidor', required: true }
        ];
        if (tipo === 'aluno') {
            where.alunoId = { [Op.not]: null };
            if (busca && busca.trim() !== '') {
                include[0].where = { nome: { [Op.like]: `%${busca}%` } };
                include[0].required = true;
            }
        } else if (tipo === 'professor') {
            where.professorId = { [Op.not]: null };
            if (busca && busca.trim() !== '') {
                include[1].where = { nome: { [Op.like]: `%${busca}%` } };
                include[1].required = true;
            }
        }
        const retiradas = await Retirada.findAll({ where, include, order: [['dataRetirada', 'DESC'], ['horaRetirada', 'DESC']] });
        let resultadosFiltrados = retiradas;
        if (busca && busca.trim() !== '' && !tipo) {
            const buscaLower = busca.toLowerCase();
            resultadosFiltrados = retiradas.filter(r => {
                const nomeAluno = r.Aluno ? r.Aluno.nome.toLowerCase() : '';
                const nomeProfessor = r.Professor ? r.Professor.nome.toLowerCase() : '';
                return nomeAluno.includes(buscaLower) || nomeProfessor.includes(buscaLower);
            });
        }
        res.render('retiradas', { lista: true, retiradas: resultadosFiltrados.map(r => r.toJSON()), busca: busca || '', tipo: tipo || '' });
    } catch (error) {
        console.error('Erro ao listar retiradas:', error);
        res.status(500).send('Erro ao listar retiradas: ' + error.message);
    }
});

app.get('/retiradas/nova', async (req, res) => {
    const alunos = await Aluno.findAll();
    const professores = await Professor.findAll();
    const materiais = await Material.findAll();
    const servidores = await Servidor.findAll();
    res.render('retiradas', { form: true, alunos: alunos.map(a => a.toJSON()), professores: professores.map(p => p.toJSON()), materiais: materiais.map(m => m.toJSON()), servidores: servidores.map(s => s.toJSON()) });
});

app.get('/retiradas/:id/editar', async (req, res) => {
    const retirada = await Retirada.findByPk(req.params.id);
    const alunos = await Aluno.findAll();
    const professores = await Professor.findAll();
    const materiais = await Material.findAll();
    const servidores = await Servidor.findAll();
    if (!retirada) return res.status(404).send('Retirada nao encontrada');
    res.render('retiradas', { form: true, retirada: retirada.toJSON(), alunos: alunos.map(a => a.toJSON()), professores: professores.map(p => p.toJSON()), materiais: materiais.map(m => m.toJSON()), servidores: servidores.map(s => s.toJSON()) });
});

app.get('/retiradas/ver/:id', async (req, res) => {
    const retirada = await Retirada.findByPk(req.params.id, {
        include: [{ model: Aluno, as: 'Aluno' }, { model: Professor, as: 'Professor' }, { model: Material, as: 'Material' }, { model: Servidor, as: 'Servidor' }]
    });
    if (!retirada) return res.status(404).send('Retirada nao encontrada');
    res.render('retiradas', { detalhe: true, retirada: retirada.toJSON() });
});

app.post('/retiradas', async (req, res) => {
    try {
        const { materialId, quantidade, tipoRetirada } = req.body;
        const material = await Material.findByPk(materialId);
        if (!material) return res.status(404).send('Material nao encontrado');
        if (material.quantidade < parseInt(quantidade)) {
            return res.status(400).send(`Estoque insuficiente! Disponivel: ${material.quantidade}, Solicitado: ${quantidade}`);
        }
        const dadosRetirada = { ...req.body };
        if (tipoRetirada === 'aluno') {
            delete dadosRetirada.professorId;
        } else {
            delete dadosRetirada.alunoId;
        }
        delete dadosRetirada.tipoRetirada;
        await Retirada.create(dadosRetirada);
        material.quantidade -= parseInt(quantidade);
        await material.save();
        res.redirect('/retiradas');
    } catch (error) {
        console.error('Erro ao criar retirada:', error);
        res.status(500).send('Erro ao criar retirada: ' + error.message);
    }
});

app.post('/retiradas/:id/editar', async (req, res) => {
    try {
        const retirada = await Retirada.findByPk(req.params.id);
        if (!retirada) return res.status(404).send('Retirada nao encontrada');
        const { materialId, quantidade, tipoRetirada } = req.body;
        const quantidadeAnterior = retirada.quantidade;
        const materialAnteriorId = retirada.materialId;
        if (materialAnteriorId != materialId || quantidadeAnterior != quantidade) {
            const materialAnterior = await Material.findByPk(materialAnteriorId);
            materialAnterior.quantidade += quantidadeAnterior;
            await materialAnterior.save();
            const materialNovo = await Material.findByPk(materialId);
            if (materialNovo.quantidade < parseInt(quantidade)) {
                materialAnterior.quantidade -= quantidadeAnterior;
                await materialAnterior.save();
                return res.status(400).send(`Estoque insuficiente! Disponivel: ${materialNovo.quantidade}, Solicitado: ${quantidade}`);
            }
            materialNovo.quantidade -= parseInt(quantidade);
            await materialNovo.save();
        }
        const dadosAtualizacao = { ...req.body };
        if (tipoRetirada === 'aluno') {
            dadosAtualizacao.professorId = null;
        } else {
            dadosAtualizacao.alunoId = null;
        }
        delete dadosAtualizacao.tipoRetirada;
        await Retirada.update(dadosAtualizacao, { where: { id: req.params.id } });
        res.redirect('/retiradas');
    } catch (error) {
        console.error('Erro ao editar retirada:', error);
        res.status(500).send('Erro ao editar retirada: ' + error.message);
    }
});

app.post('/retiradas/excluir/:id', async (req, res) => {
    try {
        const retirada = await Retirada.findByPk(req.params.id);
        if (!retirada) return res.status(404).send('Retirada nao encontrada');
        const material = await Material.findByPk(retirada.materialId);
        material.quantidade += retirada.quantidade;
        await material.save();
        await Retirada.destroy({ where: { id: req.params.id } });
        res.redirect('/retiradas');
    } catch (error) {
        console.error('Erro ao excluir retirada:', error);
        res.status(500).send('Erro ao excluir retirada: ' + error.message);
    }
});

app.get('/reestoques', async (req, res) => {
    try {
        const reestoques = await Reestoque.findAll({
            include: [
                { model: Material, as: 'Material' },
                { model: Fornecedor, as: 'Fornecedor' }
            ],
            order: [['dataReestoque', 'DESC']]
        });
        res.render('reestoque', { lista: true, reestoques: reestoques.map(r => r.toJSON()) });
    } catch (error) {
        console.error('Erro ao listar reestoques:', error);
        res.status(500).send('Erro ao listar reestoques: ' + error.message);
    }
});

app.get('/reestoques/novo', async (req, res) => {
    const materiais = await Material.findAll();
    const fornecedores = await Fornecedor.findAll();
    res.render('reestoque', { 
        form: true, 
        materiais: materiais.map(m => m.toJSON()), 
        fornecedores: fornecedores.map(f => f.toJSON()) 
    });
});

app.get('/reestoques/:id/editar', async (req, res) => {
    const reestoque = await Reestoque.findByPk(req.params.id);
    const materiais = await Material.findAll();
    const fornecedores = await Fornecedor.findAll();
    if (!reestoque) return res.status(404).send('Reestoque não encontrado');
    res.render('reestoque', { 
        form: true, 
        reestoque: reestoque.toJSON(), 
        materiais: materiais.map(m => m.toJSON()), 
        fornecedores: fornecedores.map(f => f.toJSON()) 
    });
});

app.get('/reestoques/ver/:id', async (req, res) => {
    const reestoque = await Reestoque.findByPk(req.params.id, {
        include: [
            { model: Material, as: 'Material' },
            { model: Fornecedor, as: 'Fornecedor' }
        ]
    });
    if (!reestoque) return res.status(404).send('Reestoque não encontrado');
    res.render('reestoque', { detalhe: true, reestoque: reestoque.toJSON() });
});

app.post('/reestoques', async (req, res) => {
    try {
        const { materialId, quantidade, valorUnitario } = req.body;
        const valorTotal = parseFloat(valorUnitario) * parseInt(quantidade);
        await Reestoque.create({
            ...req.body,
            valorTotal: valorTotal
        });
        const material = await Material.findByPk(materialId);
        material.quantidade += parseInt(quantidade);
        await material.save();
        res.redirect('/reestoques');
    } catch (error) {
        console.error('Erro ao criar reestoque:', error);
        res.status(500).send('Erro ao criar reestoque: ' + error.message);
    }
});

app.post('/reestoques/:id/editar', async (req, res) => {
    try {
        const reestoque = await Reestoque.findByPk(req.params.id);
        if (!reestoque) return res.status(404).send('Reestoque não encontrado');
        const { materialId, quantidade, valorUnitario } = req.body;
        const quantidadeAnterior = reestoque.quantidade;
        const materialAnteriorId = reestoque.materialId;
        const materialAnterior = await Material.findByPk(materialAnteriorId);
        materialAnterior.quantidade -= quantidadeAnterior;
        await materialAnterior.save();
        const materialNovo = await Material.findByPk(materialId);
        materialNovo.quantidade += parseInt(quantidade);
        await materialNovo.save();
        const valorTotal = parseFloat(valorUnitario) * parseInt(quantidade);
        await Reestoque.update({
            ...req.body,
            valorTotal: valorTotal
        }, { where: { id: req.params.id } });
        res.redirect('/reestoques');
    } catch (error) {
        console.error('Erro ao editar reestoque:', error);
        res.status(500).send('Erro ao editar reestoque: ' + error.message);
    }
});

app.post('/reestoques/excluir/:id', async (req, res) => {
    try {
        const reestoque = await Reestoque.findByPk(req.params.id);
        if (!reestoque) return res.status(404).send('Reestoque não encontrado');
        const material = await Material.findByPk(reestoque.materialId);
        material.quantidade -= reestoque.quantidade;
        await material.save();
        await Reestoque.destroy({ where: { id: req.params.id } });
        res.redirect('/reestoques');
    } catch (error) {
        console.error('Erro ao excluir reestoque:', error);
        res.status(500).send('Erro ao excluir reestoque: ' + error.message);
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});