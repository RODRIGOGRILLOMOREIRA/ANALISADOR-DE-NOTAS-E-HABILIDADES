// Script para popular o banco de dados com dados de teste
// Execute com: node seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const User = require('./src/models/User');
const Professor = require('./src/models/Professor');
const Disciplina = require('./src/models/Disciplina');
const Turma = require('./src/models/Turma');
const Aluno = require('./src/models/Aluno');
const Avaliacao = require('./src/models/Avaliacao');
const Habilidade = require('./src/models/Habilidade');

const seedDatabase = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Limpar banco
    console.log('🗑️  Limpando banco de dados...');
    await User.deleteMany({});
    await Professor.deleteMany({});
    await Disciplina.deleteMany({});
    await Turma.deleteMany({});
    await Aluno.deleteMany({});
    await Avaliacao.deleteMany({});
    await Habilidade.deleteMany({});

    // Criar usuários
    console.log('👤 Criando usuários...');
    const users = await User.create([
      {
        nome: 'Administrador',
        email: 'admin@escola.com',
        senha: 'admin123',
        tipo: 'admin'
      },
      {
        nome: 'Maria Silva',
        email: 'maria@escola.com',
        senha: 'senha123',
        tipo: 'professor'
      },
      {
        nome: 'João Santos',
        email: 'joao@escola.com',
        senha: 'senha123',
        tipo: 'professor'
      }
    ]);

    // Criar disciplinas
    console.log('📚 Criando disciplinas...');
    const disciplinas = await Disciplina.create([
      { nome: 'Matemática', codigo: 'MAT', cargaHoraria: 80 },
      { nome: 'Português', codigo: 'POR', cargaHoraria: 80 },
      { nome: 'História', codigo: 'HIS', cargaHoraria: 60 },
      { nome: 'Geografia', codigo: 'GEO', cargaHoraria: 60 },
      { nome: 'Ciências', codigo: 'CIE', cargaHoraria: 60 },
      { nome: 'Inglês', codigo: 'ING', cargaHoraria: 40 }
    ]);

    // Criar professores
    console.log('👨‍🏫 Criando professores...');
    const professores = await Professor.create([
      {
        nome: 'Maria Silva',
        email: 'maria@escola.com',
        telefone: '(11) 98765-4321',
        disciplinas: [disciplinas[0]._id, disciplinas[1]._id],
        user: users[1]._id
      },
      {
        nome: 'João Santos',
        email: 'joao@escola.com',
        telefone: '(11) 98765-1234',
        disciplinas: [disciplinas[2]._id, disciplinas[3]._id],
        user: users[2]._id
      }
    ]);

    // Criar turma
    console.log('🎓 Criando turmas...');
    const turmas = await Turma.create([
      {
        nome: '6º A',
        ano: 2026,
        serie: '6º ano',
        turno: 'matutino',
        disciplinas: [
          { disciplina: disciplinas[0]._id, professor: professores[0]._id },
          { disciplina: disciplinas[1]._id, professor: professores[0]._id },
          { disciplina: disciplinas[2]._id, professor: professores[1]._id },
          { disciplina: disciplinas[3]._id, professor: professores[1]._id }
        ]
      },
      {
        nome: '7º B',
        ano: 2026,
        serie: '7º ano',
        turno: 'vespertino',
        disciplinas: [
          { disciplina: disciplinas[0]._id, professor: professores[0]._id },
          { disciplina: disciplinas[1]._id, professor: professores[0]._id }
        ]
      }
    ]);

    // Criar alunos
    console.log('👨‍🎓 Criando alunos...');
    const alunos = await Aluno.create([
      {
        nome: 'Pedro Henrique',
        matricula: '2026001',
        dataNascimento: new Date('2014-05-15'),
        responsavel: {
          nome: 'Ana Henrique',
          telefone: '(11) 91111-1111',
          email: 'ana@email.com'
        },
        turma: turmas[0]._id
      },
      {
        nome: 'Júlia Oliveira',
        matricula: '2026002',
        dataNascimento: new Date('2014-08-22'),
        responsavel: {
          nome: 'Carlos Oliveira',
          telefone: '(11) 92222-2222',
          email: 'carlos@email.com'
        },
        turma: turmas[0]._id
      },
      {
        nome: 'Lucas Souza',
        matricula: '2026003',
        dataNascimento: new Date('2014-03-10'),
        responsavel: {
          nome: 'Mariana Souza',
          telefone: '(11) 93333-3333',
          email: 'mariana@email.com'
        },
        turma: turmas[0]._id
      }
    ]);

    // Atualizar turma com alunos
    turmas[0].alunos = alunos.map(a => a._id);
    await turmas[0].save();

    // Criar avaliações
    console.log('📝 Criando avaliações...');
    for (const aluno of alunos) {
      for (let trim = 1; trim <= 3; trim++) {
        await Avaliacao.create({
          aluno: aluno._id,
          disciplina: disciplinas[0]._id,
          turma: turmas[0]._id,
          professor: professores[0]._id,
          ano: 2026,
          trimestre: trim,
          avaliacoes: [
            {
              tipo: 'prova',
              descricao: `Prova ${trim}º Trimestre`,
              nota: Math.random() * 3 + 7, // 7 a 10
              peso: 2,
              data: new Date()
            },
            {
              tipo: 'trabalho',
              descricao: `Trabalho ${trim}º Trimestre`,
              nota: Math.random() * 2 + 8, // 8 a 10
              peso: 1,
              data: new Date()
            }
          ]
        });
      }
    }

    // Criar habilidades
    console.log('🎯 Criando habilidades...');
    await Habilidade.create({
      codigo: 'EF06MA01',
      descricao: 'Comparar, ordenar, ler e escrever números naturais e números racionais',
      disciplina: disciplinas[0]._id,
      ano: 2026,
      trimestre: 1,
      turma: turmas[0]._id,
      alunosDesempenho: alunos.map(aluno => ({
        aluno: aluno._id,
        nivel: 'desenvolvido',
        observacao: 'Bom desempenho'
      }))
    });

    console.log('✅ Banco de dados populado com sucesso!');
    console.log('\n📊 Dados criados:');
    console.log(`- ${users.length} usuários`);
    console.log(`- ${professores.length} professores`);
    console.log(`- ${disciplinas.length} disciplinas`);
    console.log(`- ${turmas.length} turmas`);
    console.log(`- ${alunos.length} alunos`);
    console.log('\n👤 Login de teste:');
    console.log('   Email: admin@escola.com');
    console.log('   Senha: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
    process.exit(1);
  }
};

seedDatabase();
