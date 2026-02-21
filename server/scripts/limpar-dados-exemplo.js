// Script para limpar dados de exemplo criados pelos seeds
require('dotenv').config();
const mongoose = require('mongoose');

// Models
const User = require('../src/models/User');
const Professor = require('../src/models/Professor');
const Disciplina = require('../src/models/Disciplina');
const Turma = require('../src/models/Turma');
const Aluno = require('../src/models/Aluno');
const Avaliacao = require('../src/models/Avaliacao');
const Habilidade = require('../src/models/Habilidade');
const Frequencia = require('../src/models/Frequencia');

const limparDadosExemplo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB\n');

    console.log('🔍 Identificando dados de exemplo...\n');

    // Usuários de exemplo
    const usersExemplo = await User.find({ email: /@escola\.com$/i });
    console.log(`📧 Usuários de exemplo: ${usersExemplo.length}`);

    // Professores de exemplo
    const professoresExemplo = await Professor.find({ email: /@escola\.com$/i });
    console.log(`👨‍🏫 Professores de exemplo: ${professoresExemplo.length}`);

    // Alunos de exemplo (matrículas 2026xxx e JOAO/ana)
    const alunosExemplo = await Aluno.find({ 
      $or: [
        { matricula: /^2026/ },
        { matricula: '0001' },
        { matricula: '000001' }
      ]
    });
    console.log(`👨‍🎓 Alunos de exemplo: ${alunosExemplo.length}`);

    // Turmas de exemplo
    const turmasExemplo = await Turma.find({ 
      nome: { $in: ['6º A', '7º B', '8º A', '9º A', '7º ANO', '8º ANO', '9º ANO'] } 
    });
    console.log(`🏫 Turmas de exemplo: ${turmasExemplo.length}`);

    // Disciplinas de exemplo
    const disciplinasExemplo = await Disciplina.find({ 
      codigo: { $in: ['MAT', 'POR', 'HIS', 'GEO', 'CIE', 'ING'] } 
    });
    console.log(`📚 Disciplinas de exemplo: ${disciplinasExemplo.length}`);

    // Habilidades de teste
    const habilidadesExemplo = await Habilidade.find({
      $or: [
        { descricao: /^BBBBBBBB/ },
        { codigo: { $regex: /^TEST/i } }
      ]
    });
    console.log(`🎯 Habilidades de exemplo: ${habilidadesExemplo.length}\n`);

    console.log('🗑️  Removendo dados de exemplo...\n');

    // IDs dos alunos de exemplo
    const alunosExemploIds = alunosExemplo.map(a => a._id);

    // 1. Remover frequências primeiro
    const frequenciasRemovidas = await Frequencia.deleteMany({ 
      aluno: { $in: alunosExemploIds } 
    });
    console.log(`✅ ${frequenciasRemovidas.deletedCount} Frequências removidas`);

    // 2. Remover usuários
    const usersRemovidos = await User.deleteMany({ email: /@escola\.com$/i });
    console.log(`✅ ${usersRemovidos.deletedCount} Usuários removidos`);

    // 3. Remover professores
    const professoresRemovidos = await Professor.deleteMany({ email: /@escola\.com$/i });
    console.log(`✅ ${professoresRemovidos.deletedCount} Professores removidos`);

    // 4. Remover avaliações vazias
    const avaliacoesRemovidas = await Avaliacao.deleteMany({
      $or: [
        { titulo: { $exists: false } },
        { titulo: null },
        { titulo: '' }
      ]
    });
    console.log(`✅ ${avaliacoesRemovidas.deletedCount} Avaliações removidas`);

    // 5. Remover alunos de exemplo
    const alunosRemovidos = await Aluno.deleteMany({ 
      $or: [
        { matricula: /^2026/ },
        { matricula: '0001' },
        { matricula: '000001' }
      ]
    });
    console.log(`✅ ${alunosRemovidos.deletedCount} Alunos removidos`);

    // 6. Remover turmas de exemplo
    const turmasRemovidas = await Turma.deleteMany({ 
      nome: { $in: ['6º A', '7º B', '8º A', '9º A', '7º ANO', '8º ANO', '9º ANO'] } 
    });
    console.log(`✅ ${turmasRemovidas.deletedCount} Turmas removidas`);

    // 7. Remover disciplinas de exemplo
    const disciplinasRemovidas = await Disciplina.deleteMany({ 
      codigo: { $in: ['MAT', 'POR', 'HIS', 'GEO', 'CIE', 'ING'] } 
    });
    console.log(`✅ ${disciplinasRemovidas.deletedCount} Disciplinas removidas`);

    // 8. Remover habilidades de teste
    const habilidadesRemovidas = await Habilidade.deleteMany({
      $or: [
        { descricao: /^BBBBBBBB/ },
        { codigo: { $regex: /^TEST/i } }
      ]
    });
    console.log(`✅ ${habilidadesRemovidas.deletedCount} Habilidades removidas`);

    console.log('\n🎉 Limpeza concluída com sucesso!');
    console.log('✨ Dados importados foram preservados.\n');

    // Verificar resultado final
    const totalAlunos = await Aluno.countDocuments();
    const totalTurmas = await Turma.countDocuments();
    
    console.log(`📊 Total de alunos restantes: ${totalAlunos}`);
    console.log(`📚 Total de turmas restantes: ${totalTurmas}`);

    await mongoose.disconnect();
    console.log('\n👋 Desconectado do MongoDB');

  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
};

limparDadosExemplo();
