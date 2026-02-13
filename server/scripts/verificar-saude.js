// Script para verificar a saúde do banco de dados
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Professor = require('./src/models/Professor');
const Disciplina = require('./src/models/Disciplina');
const Turma = require('./src/models/Turma');
const Aluno = require('./src/models/Aluno');
const Avaliacao = require('./src/models/Avaliacao');
const Habilidade = require('./src/models/Habilidade');

const verificarSaude = async () => {
  try {
    console.log('🔍 Verificando saúde do banco de dados...\n');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conexão com MongoDB estabelecida\n');

    // Contar documentos
    const stats = {
      usuarios: await User.countDocuments(),
      professores: await Professor.countDocuments({ ativo: true }),
      disciplinas: await Disciplina.countDocuments({ ativo: true }),
      turmas: await Turma.countDocuments({ ativo: true }),
      alunos: await Aluno.countDocuments({ ativo: true }),
      avaliacoes: await Avaliacao.countDocuments(),
      habilidades: await Habilidade.countDocuments({ ativo: true })
    };

    console.log('📊 Estatísticas do Banco:');
    console.log('─────────────────────────');
    console.log(`👤 Usuários:      ${stats.usuarios}`);
    console.log(`👨‍🏫 Professores:   ${stats.professores}`);
    console.log(`📚 Disciplinas:   ${stats.disciplinas}`);
    console.log(`🎓 Turmas:        ${stats.turmas}`);
    console.log(`👨‍🎓 Alunos:        ${stats.alunos}`);
    console.log(`📝 Avaliações:    ${stats.avaliacoes}`);
    console.log(`🎯 Habilidades:   ${stats.habilidades}`);
    console.log('─────────────────────────\n');

    // Verificar turmas
    const turmas = await Turma.find({ ativo: true })
      .populate('alunos')
      .select('nome serie ano alunos capacidadeMaxima');

    console.log('🎓 Ocupação das Turmas:');
    console.log('─────────────────────────');
    turmas.forEach(turma => {
      const ocupacao = turma.alunos.length;
      const capacidade = turma.capacidadeMaxima || 35;
      const percentual = ((ocupacao / capacidade) * 100).toFixed(1);
      const status = ocupacao >= capacidade ? '🔴' : ocupacao >= capacidade * 0.8 ? '🟡' : '🟢';
      console.log(`${status} ${turma.nome} (${turma.serie}): ${ocupacao}/${capacidade} alunos (${percentual}%)`);
    });
    console.log('─────────────────────────\n');

    // Verificar alunos sem turma
    const alunosSemTurma = await Aluno.countDocuments({ ativo: true, turma: null });
    if (alunosSemTurma > 0) {
      console.log(`⚠️  ${alunosSemTurma} aluno(s) sem turma atribuída\n`);
    }

    // Verificar espaço disponível
    const dbStats = await mongoose.connection.db.stats();
    const espacoMB = (dbStats.dataSize / 1024 / 1024).toFixed(2);
    const espacoGB = (dbStats.dataSize / 1024 / 1024 / 1024).toFixed(3);
    
    console.log('💾 Uso de Armazenamento:');
    console.log('─────────────────────────');
    console.log(`📦 Dados: ${espacoMB} MB (${espacoGB} GB)`);
    console.log(`📑 Coleções: ${dbStats.collections}`);
    console.log(`📄 Documentos: ${dbStats.objects}`);
    
    if (dbStats.dataSize < 512 * 1024 * 1024) {
      console.log(`✅ Espaço suficiente (Limite M0: 512 MB)`);
    } else {
      console.log(`⚠️  Próximo do limite do plano M0 (512 MB)`);
    }
    console.log('─────────────────────────\n');

    // Verificar índices
    console.log('🔗 Índices Criados:');
    console.log('─────────────────────────');
    const collections = ['users', 'professores', 'disciplinas', 'turmas', 'alunos', 'avaliacaos', 'habilidades'];
    
    for (const collName of collections) {
      try {
        const indexes = await mongoose.connection.db.collection(collName).indexes();
        console.log(`📋 ${collName}: ${indexes.length} índice(s)`);
      } catch (error) {
        console.log(`⚠️  ${collName}: Coleção não encontrada`);
      }
    }
    console.log('─────────────────────────\n');

    // Recomendações
    console.log('💡 Recomendações:');
    console.log('─────────────────────────');
    
    if (stats.alunos === 0) {
      console.log('⚠️  Execute: node seed.js (para criar dados iniciais)');
    }
    
    if (stats.turmas < 9) {
      console.log('⚠️  Execute: node scripts/criar-turmas.js (para criar turmas do 1º ao 9º)');
    }
    
    if (alunosSemTurma > 0) {
      console.log('⚠️  Atribua turmas aos alunos sem turma');
    }

    if (stats.avaliacoes === 0 && stats.alunos > 0) {
      console.log('ℹ️  Não há avaliações cadastradas ainda');
    }

    console.log('─────────────────────────\n');
    console.log('✅ Verificação concluída!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
};

verificarSaude();
