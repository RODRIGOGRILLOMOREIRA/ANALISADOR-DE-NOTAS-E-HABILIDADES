// Script para gerar matrículas automáticas para alunos
require('dotenv').config();
const mongoose = require('mongoose');
const Aluno = require('./src/models/Aluno');

const gerarMatriculas = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    const alunos = await Aluno.find({ matricula: { $exists: false } });
    
    if (alunos.length === 0) {
      console.log('ℹ️  Todos os alunos já possuem matrícula');
      process.exit(0);
    }

    console.log(`📝 Gerando matrículas para ${alunos.length} alunos...`);

    const ano = new Date().getFullYear();
    let contador = await Aluno.countDocuments({ matricula: { $regex: `^${ano}` } });

    for (const aluno of alunos) {
      contador++;
      const matricula = `${ano}${String(contador).padStart(4, '0')}`;
      aluno.matricula = matricula;
      await aluno.save();
      console.log(`   ✓ ${aluno.nome}: ${matricula}`);
    }

    console.log('✅ Matrículas geradas com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
};

gerarMatriculas();
