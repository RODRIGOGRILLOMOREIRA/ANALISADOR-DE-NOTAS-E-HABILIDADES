// Script para limpar todos os registros de frequência
// Execute com: node scripts/limpar-frequencias.js

require('dotenv').config();
const mongoose = require('mongoose');
const Frequencia = require('../src/models/Frequencia');
const Aluno = require('../src/models/Aluno');
const Turma = require('../src/models/Turma');
const Disciplina = require('../src/models/Disciplina');

const limparFrequencias = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB\n');

    // Contar frequências antes
    const totalAntes = await Frequencia.countDocuments();
    console.log(`📊 Total de frequências no banco: ${totalAntes}\n`);

    if (totalAntes === 0) {
      console.log('ℹ️  Não há frequências para limpar.');
      await mongoose.disconnect();
      return;
    }

    // Listar algumas frequências como exemplo
    const amostra = await Frequencia.find()
      .limit(10)
      .populate('aluno', 'nome matricula')
      .populate('turma', 'nome')
      .populate('disciplina', 'nome');

    console.log('📋 Amostra de frequências que serão removidas:');
    amostra.forEach((freq, idx) => {
      console.log(`  ${idx + 1}. ${freq.aluno?.nome || 'Aluno desconhecido'} - ${freq.turma?.nome || 'Turma desconhecida'} - ${new Date(freq.data).toLocaleDateString('pt-BR')} - ${freq.status}`);
    });
    console.log('');

    console.log('⚠️  ATENÇÃO: Esta operação irá REMOVER TODOS os registros de frequência!');
    console.log('💡 Executando remoção...\n');

    // Executar a remoção
    const resultado = await Frequencia.deleteMany({});
    
    console.log(`\n✅ ${resultado.deletedCount} registros de frequência removidos com sucesso!`);

    await mongoose.disconnect();
    console.log('👋 Desconectado do MongoDB');

  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
};

limparFrequencias();
