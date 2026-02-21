require('dotenv').config();
const mongoose = require('mongoose');
const Aluno = require('../src/models/Aluno');
const Turma = require('../src/models/Turma');

async function verificarAlunos() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Buscar todas as turmas
    const turmas = await Turma.find();
    console.log('\n📚 Turmas cadastradas:');
    turmas.forEach(turma => {
      console.log(`  - ${turma.nome} (ID: ${turma._id})`);
    });

    // Contar total de alunos
    const totalAlunos = await Aluno.countDocuments();
    console.log(`\n👥 Total de alunos no banco: ${totalAlunos}`);

    // Listar todos os alunos com suas turmas
    const alunos = await Aluno.find().populate('turma', 'nome');
    console.log('\n📋 Lista de alunos:');
    
    const alunosPorTurma = {};
    
    alunos.forEach((aluno, index) => {
      const turmaNome = aluno.turma ? aluno.turma.nome : 'SEM TURMA';
      
      if (!alunosPorTurma[turmaNome]) {
        alunosPorTurma[turmaNome] = [];
      }
      alunosPorTurma[turmaNome].push(aluno);
      
      console.log(`  ${index + 1}. ${aluno.nome} - Matrícula: ${aluno.matricula} - Turma: ${turmaNome}`);
    });

    // Resumo por turma
    console.log('\n📊 Resumo por turma:');
    Object.keys(alunosPorTurma).forEach(turmaNome => {
      console.log(`  ${turmaNome}: ${alunosPorTurma[turmaNome].length} alunos`);
    });

    // Verificar se há alunos duplicados (mesma matrícula)
    const matriculas = alunos.map(a => a.matricula);
    const duplicadas = matriculas.filter((mat, index) => matriculas.indexOf(mat) !== index);
    
    if (duplicadas.length > 0) {
      console.log('\n⚠️ MATRÍCULAS DUPLICADAS ENCONTRADAS:');
      duplicadas.forEach(mat => {
        const alunosDuplicados = alunos.filter(a => a.matricula === mat);
        console.log(`  Matrícula ${mat}:`);
        alunosDuplicados.forEach(a => {
          console.log(`    - ID: ${a._id}, Nome: ${a.nome}`);
        });
      });
    } else {
      console.log('\n✅ Não há matrículas duplicadas');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

verificarAlunos();
