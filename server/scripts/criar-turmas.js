// Script para criar turmas do 1º ao 9º ano
require('dotenv').config();
const mongoose = require('mongoose');
const Turma = require('./src/models/Turma');
const Disciplina = require('./src/models/Disciplina');
const Professor = require('./src/models/Professor');

const criarTurmasPadrao = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Buscar disciplinas e professores existentes
    const disciplinas = await Disciplina.find({ ativo: true }).limit(6);
    const professores = await Professor.find({ ativo: true }).limit(10);

    if (disciplinas.length === 0 || professores.length === 0) {
      console.log('❌ Execute o seed.js primeiro para criar disciplinas e professores');
      process.exit(1);
    }

    console.log('📚 Criando turmas do 1º ao 9º ano...');

    const anoLetivo = 2026;
    const turmasData = [];

    // Definição das séries
    const series = [
      { nome: '1º A', serie: '1º ano', capacidade: 30 },
      { nome: '2º A', serie: '2º ano', capacidade: 30 },
      { nome: '3º A', serie: '3º ano', capacidade: 32 },
      { nome: '4º A', serie: '4º ano', capacidade: 32 },
      { nome: '5º A', serie: '5º ano', capacidade: 32 },
      { nome: '6º A', serie: '6º ano', capacidade: 35 },
      { nome: '7º A', serie: '7º ano', capacidade: 35 },
      { nome: '8º A', serie: '8º ano', capacidade: 35 },
      { nome: '9º A', serie: '9º ano', capacidade: 35 }
    ];

    const turnos = ['matutino', 'vespertino'];

    // Criar turmas
    for (let i = 0; i < series.length; i++) {
      const turma = series[i];
      const turno = i < 5 ? 'matutino' : 'vespertino'; // 1º ao 5º manhã, 6º ao 9º tarde

      // Associar disciplinas com professores (rodiziando)
      const disciplinasTurma = disciplinas.slice(0, 4).map((disc, idx) => ({
        disciplina: disc._id,
        professor: professores[idx % professores.length]._id
      }));

      turmasData.push({
        nome: turma.nome,
        ano: anoLetivo,
        serie: turma.serie,
        turno: turno,
        capacidadeMaxima: turma.capacidade,
        disciplinas: disciplinasTurma,
        alunos: [],
        ativo: true
      });
    }

    // Deletar turmas antigas (se existirem)
    await Turma.deleteMany({ ano: anoLetivo });

    // Criar novas turmas
    const turmasCriadas = await Turma.create(turmasData);

    console.log('✅ Turmas criadas com sucesso!');
    console.log('\n📊 Resumo:');
    turmasCriadas.forEach(t => {
      console.log(`   - ${t.nome} (${t.serie}) - ${t.turno} - Capacidade: ${t.capacidadeMaxima}`);
    });

    console.log(`\n✨ Total: ${turmasCriadas.length} turmas criadas`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
};

criarTurmasPadrao();
