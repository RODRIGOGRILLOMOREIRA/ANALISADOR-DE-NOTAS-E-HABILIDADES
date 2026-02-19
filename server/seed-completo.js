// Script COMPLETO para popular o banco com dados realistas
// Execute com: node seed-completo.js (de dentro da pasta server)
// Ou: node server/seed-completo.js (da raiz do projeto)

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');

// Models
const User = require('./src/models/User');
const Professor = require('./src/models/Professor');
const Disciplina = require('./src/models/Disciplina');
const Turma = require('./src/models/Turma');
const Aluno = require('./src/models/Aluno');
const Avaliacao = require('./src/models/Avaliacao');
const Habilidade = require('./src/models/Habilidade');

// Dados de exemplo
const DISCIPLINAS_DATA = [
  { nome: 'Matemática', codigo: 'MAT', cargaHoraria: 160 },
  { nome: 'Português', codigo: 'POR', cargaHoraria: 160 },
  { nome: 'História', codigo: 'HIS', cargaHoraria: 80 },
  { nome: 'Geografia', codigo: 'GEO', cargaHoraria: 80 },
  { nome: 'Ciências', codigo: 'CIE', cargaHoraria: 100 },
  { nome: 'Inglês', codigo: 'ING', cargaHoraria: 80 },
  { nome: 'Educação Física', codigo: 'EDF', cargaHoraria: 80 },
  { nome: 'Arte', codigo: 'ART', cargaHoraria: 80 }
];

const PROFESSORES_DATA = [
  { nome: 'Maria Silva', email: 'maria@escola.com', telefone: '(11) 98765-4321', disciplinas: ['MAT', 'CIE'] },
  { nome: 'João Santos', email: 'joao@escola.com', telefone: '(11) 98765-1234', disciplinas: ['POR', 'ART'] },
  { nome: 'Ana Costa', email: 'ana@escola.com', telefone: '(11) 98765-5678', disciplinas: ['HIS', 'GEO'] },
  { nome: 'Carlos Pereira', email: 'carlos@escola.com', telefone: '(11) 98765-9012', disciplinas: ['ING', 'EDF'] }
];

const TURMAS_DATA = [
  { nome: '6º Ano A', serie: '6º Ano', turno: 'matutino', ano: 2026 },
  { nome: '6º Ano B', serie: '6º Ano', turno: 'vespertino', ano: 2026 },
  { nome: '7º Ano A', serie: '7º Ano', turno: 'matutino', ano: 2026 },
  { nome: '8º Ano A', serie: '8º Ano', turno: 'vespertino', ano: 2026 },
  { nome: '9º Ano A', serie: '9º Ano', turno: 'matutino', ano: 2026 }
];

const ALUNOS_NOMES = [
  'Ana Clara Silva', 'Bruno Henrique Santos', 'Camila Oliveira Costa',
  'Daniel Souza Lima', 'Eduarda Ferreira Alves', 'Felipe Rodrigues Martins',
  'Gabriela Pereira Rocha', 'Henrique Carvalho Gomes', 'Isabela Ribeiro Araujo',
  'João Pedro Cardoso', 'Larissa Almeida Teixeira', 'Lucas Barbosa Dias',
  'Mariana Correia Monteiro', 'Nicolas Fernandes Castro', 'Olivia Rezende Pinto',
  'Paulo Victor Moura', 'Rafaela Duarte Lopes', 'Samuel Nascimento Freitas',
  'Sophia Cavalcanti Ramos', 'Thiago Azevedo Sousa', 'Valentina Mendes Campos',
  'Vinicius Barros Nunes', 'Yasmin Farias Guimaraes', 'Arthur Cunha Torres',
  'Beatriz Vieira Caldeira'
];

const RESPONSAVEIS_NOMES = [
  'Maria', 'José', 'Ana', 'Carlos', 'Paulo', 'Lucia', 'Roberto', 'Patricia',
  'Fernando', 'Juliana', 'Marcos', 'Sandra', 'Ricardo', 'Claudia', 'Antonio'
];

// Habilidades BNCC reais
const HABILIDADES_MATEMATICA_6ANO = [
  { codigo: 'EF06MA01', descricao: 'Comparar, ordenar, ler e escrever números naturais e números racionais', trimestre: 1 },
  { codigo: 'EF06MA03', descricao: 'Resolver e elaborar problemas que envolvam cálculos (mentais ou escritos, exatos ou aproximados) com números naturais', trimestre: 1 },
  { codigo: 'EF06MA09', descricao: 'Resolver e elaborar problemas que envolvam o cálculo da fração de uma quantidade', trimestre: 2 },
  { codigo: 'EF06MA13', descricao: 'Resolver e elaborar problemas que envolvam porcentagens', trimestre: 2 },
  { codigo: 'EF06MA18', descricao: 'Reconhecer, nomear e comparar polígonos', trimestre: 3 },
  { codigo: 'EF06MA24', descricao: 'Resolver e elaborar problemas que envolvam as grandezas comprimento, massa, tempo, temperatura', trimestre: 3 }
];

const HABILIDADES_PORTUGUES_6ANO = [
  { codigo: 'EF69LP01', descricao: 'Diferenciar liberdade de expressão de discursos de ódio', trimestre: 1 },
  { codigo: 'EF69LP05', descricao: 'Inferir e justificar, em textos multissemióticos, o efeito de humor, ironia', trimestre: 1 },
  { codigo: 'EF06LP11', descricao: 'Utilizar estratégias de planejamento, elaboração, revisão, edição, reescrita/redesign', trimestre: 2 },
  { codigo: 'EF67LP23', descricao: 'Respeitar os turnos de fala, na participação em conversações', trimestre: 2 },
  { codigo: 'EF67LP32', descricao: 'Escrever palavras com correção ortográfica, obedecendo as convenções da língua', trimestre: 3 }
];

// Função auxiliar para gerar nota aleatória
const gerarNota = (min = 5, max = 10) => {
  return Number((Math.random() * (max - min) + min).toFixed(1));
};

// Função auxiliar para gerar nível de habilidade
const gerarNivelHabilidade = () => {
  const niveis = ['nao-desenvolvido', 'em-desenvolvimento', 'desenvolvido', 'plenamente-desenvolvido'];
  const pesos = [0.05, 0.25, 0.50, 0.20]; // 5%, 25%, 50%, 20%
  const random = Math.random();
  let acumulado = 0;
  
  for (let i = 0; i < niveis.length; i++) {
    acumulado += pesos[i];
    if (random < acumulado) return niveis[i];
  }
  return 'desenvolvido';
};

const seedDatabase = async () => {
  try {
    console.log('🚀 Iniciando seed completo do banco de dados...\n');
    
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Limpar banco
    console.log('🗑️  Limpando banco de dados...');
    await Promise.all([
      User.deleteMany({}),
      Professor.deleteMany({}),
      Disciplina.deleteMany({}),
      Turma.deleteMany({}),
      Aluno.deleteMany({}),
      Avaliacao.deleteMany({}),
      Habilidade.deleteMany({})
    ]);
    console.log('✅ Banco limpo\n');

    // 1. Criar usuários
    console.log('👤 Criando usuários...');
    const usuarios = await User.create([
      {
        nome: 'Administrador do Sistema',
        email: 'admin@escola.com',
        senha: 'admin123',
        tipo: 'admin'
      },
      ...PROFESSORES_DATA.map(prof => ({
        nome: prof.nome,
        email: prof.email,
        senha: 'senha123',
        tipo: 'professor'
      }))
    ]);
    console.log(`✅ ${usuarios.length} usuários criados\n`);

    // 2. Criar disciplinas
    console.log('📚 Criando disciplinas...');
    const disciplinas = await Disciplina.create(DISCIPLINAS_DATA);
    const disciplinasMap = {};
    disciplinas.forEach(d => disciplinasMap[d.codigo] = d);
    console.log(`✅ ${disciplinas.length} disciplinas criadas\n`);

    // 3. Criar professores
    console.log('👨‍🏫 Criando professores...');
    const professores = await Professor.create(
      PROFESSORES_DATA.map((prof, index) => ({
        nome: prof.nome,
        email: prof.email,
        telefone: prof.telefone,
        disciplinas: prof.disciplinas.map(codigo => disciplinasMap[codigo]._id),
        user: usuarios[index + 1]._id // +1 pois o primeiro é admin
      }))
    );
    console.log(`✅ ${professores.length} professores criados\n`);

    // 4. Criar turmas
    console.log('🎓 Criando turmas...');
    const turmasCreated = [];
    
    for (const turmaData of TURMAS_DATA) {
      // Atribuir todas as disciplinas para cada turma
      const disciplinasTurma = [];
      
      // Matemática e Português com primeiro professor
      disciplinasTurma.push(
        { disciplina: disciplinasMap['MAT']._id, professor: professores[0]._id },
        { disciplina: disciplinasMap['CIE']._id, professor: professores[0]._id }
      );
      
      // Português e Arte com segundo professor
      disciplinasTurma.push(
        { disciplina: disciplinasMap['POR']._id, professor: professores[1]._id },
        { disciplina: disciplinasMap['ART']._id, professor: professores[1]._id }
      );
      
      // História e Geografia com terceiro professor
      disciplinasTurma.push(
        { disciplina: disciplinasMap['HIS']._id, professor: professores[2]._id },
        { disciplina: disciplinasMap['GEO']._id, professor: professores[2]._id }
      );
      
      // Inglês e Ed. Física com quarto professor
      disciplinasTurma.push(
        { disciplina: disciplinasMap['ING']._id, professor: professores[3]._id },
        { disciplina: disciplinasMap['EDF']._id, professor: professores[3]._id }
      );
      
      const turma = await Turma.create({
        ...turmaData,
        disciplinas: disciplinasTurma,
        capacidadeMaxima: 35
      });
      
      turmasCreated.push(turma);
    }
    console.log(`✅ ${turmasCreated.length} turmas criadas\n`);

    // 5. Criar alunos
    console.log('👨‍🎓 Criando alunos...');
    const alunosCriados = [];
    let matriculaCounter = 1;
    
    for (const turma of turmasCreated) {
      const numAlunos = Math.floor(Math.random() * 8) + 18; // 18 a 25 alunos por turma
      
      for (let i = 0; i < numAlunos && matriculaCounter <= ALUNOS_NOMES.length; i++) {
        const nomeAluno = ALUNOS_NOMES[matriculaCounter - 1];
        const sobrenome = nomeAluno.split(' ').pop();
        const nomeResponsavel = RESPONSAVEIS_NOMES[Math.floor(Math.random() * RESPONSAVEIS_NOMES.length)] + ' ' + sobrenome;
        
        const aluno = await Aluno.create({
          nome: nomeAluno,
          matricula: `2026${String(matriculaCounter).padStart(3, '0')}`,
          dataNascimento: new Date(2012 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          responsavel: {
            nome: nomeResponsavel,
            telefone: `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
            email: `${nomeResponsavel.toLowerCase().replace(/ /g, '.')}@email.com`
          },
          turma: turma._id
        });
        
        alunosCriados.push(aluno);
        matriculaCounter++;
      }
      
      // Atualizar turma com alunos
      const alunosDaTurma = alunosCriados.filter(a => a.turma.toString() === turma._id.toString());
      turma.alunos = alunosDaTurma.map(a => a._id);
      await turma.save();
    }
    console.log(`✅ ${alunosCriados.length} alunos criados\n`);

    // 6. Criar avaliações
    console.log('📝 Criando avaliações...');
    let avaliacoesCount = 0;
    
    // Para cada turma, criar avaliações para todos os alunos em todas as disciplinas
    for (const turma of turmasCreated) {
      const alunosDaTurma = alunosCriados.filter(a => a.turma.toString() === turma._id.toString());
      
      // Para cada disciplina da turma
      for (const disciplinaInfo of turma.disciplinas) {
        // Para cada aluno
        for (const aluno of alunosDaTurma) {
          // Para cada trimestre (1, 2, 3)
          for (let trimestre = 1; trimestre <= 3; trimestre++) {
            const avaliacoes = [];
            
            // Prova (peso maior)
            avaliacoes.push({
              tipo: 'prova',
              descricao: `Prova ${trimestre}º Trimestre`,
              nota: gerarNota(4, 10),
              peso: 1,
              data: new Date(2026, (trimestre - 1) * 3 + 2, 15)
            });
            
            // Trabalho
            avaliacoes.push({
              tipo: 'trabalho',
              descricao: `Trabalho ${trimestre}º Trimestre`,
              nota: gerarNota(6, 10),
              peso: 1,
              data: new Date(2026, (trimestre - 1) * 3 + 1, 20)
            });
            
            // Atividade/Participação
            if (Math.random() > 0.3) { // 70% dos alunos tem atividade
              avaliacoes.push({
                tipo: Math.random() > 0.5 ? 'atividade' : 'participacao',
                descricao: `${Math.random() > 0.5 ? 'Atividade' : 'Participação'} ${trimestre}º Trimestre`,
                nota: gerarNota(7, 10),
                peso: 1,
                data: new Date(2026, (trimestre - 1) * 3, 25)
              });
            }
            
            await Avaliacao.create({
              aluno: aluno._id,
              disciplina: disciplinaInfo.disciplina,
              turma: turma._id,
              professor: disciplinaInfo.professor,
              ano: 2026,
              trimestre,
              avaliacoes
            });
            
            avaliacoesCount++;
          }
        }
      }
    }
    console.log(`✅ ${avaliacoesCount} avaliações criadas\n`);

    // 7. Criar habilidades (somente para 6º Ano A - Matemática e Português)
    console.log('🎯 Criando habilidades BNCC...');
    const turma6A = turmasCreated.find(t => t.nome === '6º Ano A');
    const alunos6A = alunosCriados.filter(a => a.turma.toString() === turma6A._id.toString());
    
    // Habilidades de Matemática
    for (const habData of HABILIDADES_MATEMATICA_6ANO) {
      await Habilidade.create({
        codigo: habData.codigo,
        descricao: habData.descricao,
        disciplina: disciplinasMap['MAT']._id,
        ano: 2026,
        trimestre: habData.trimestre,
        turma: turma6A._id,
        alunosDesempenho: alunos6A.map(aluno => ({
          aluno: aluno._id,
          nivel: gerarNivelHabilidade(),
          observacao: Math.random() > 0.7 ? 'Precisa de mais atenção' : 'Bom desempenho'
        }))
      });
    }
    
    // Habilidades de Português
    for (const habData of HABILIDADES_PORTUGUES_6ANO) {
      await Habilidade.create({
        codigo: habData.codigo,
        descricao: habData.descricao,
        disciplina: disciplinasMap['POR']._id,
        ano: 2026,
        trimestre: habData.trimestre,
        turma: turma6A._id,
        alunosDesempenho: alunos6A.map(aluno => ({
          aluno: aluno._id,
          nivel: gerarNivelHabilidade(),
          observacao: Math.random() > 0.6 ? 'Ótimo progresso' : 'Continuar estimulando'
        }))
      });
    }
    console.log(`✅ ${HABILIDADES_MATEMATICA_6ANO.length + HABILIDADES_PORTUGUES_6ANO.length} habilidades criadas\n`);

    // Resumo final
    console.log('╔════════════════════════════════════════════╗');
    console.log('║   ✅ BANCO POPULADO COM SUCESSO!          ║');
    console.log('╚════════════════════════════════════════════╝\n');
    console.log('📊 DADOS CRIADOS:');
    console.log(`   👤 ${usuarios.length} usuários`);
    console.log(`   👨‍🏫 ${professores.length} professores`);
    console.log(`   📚 ${disciplinas.length} disciplinas`);
    console.log(`   🎓 ${turmasCreated.length} turmas`);
    console.log(`   👨‍🎓 ${alunosCriados.length} alunos`);
    console.log(`   📝 ${avaliacoesCount} avaliações`);
    console.log(`   🎯 ${HABILIDADES_MATEMATICA_6ANO.length + HABILIDADES_PORTUGUES_6ANO.length} habilidades\n`);
    
    console.log('🔐 CREDENCIAIS DE ACESSO:');
    console.log('   ╔═══════════════════════════════════════╗');
    console.log('   ║  Email: admin@escola.com              ║');
    console.log('   ║  Senha: admin123                      ║');
    console.log('   ╚═══════════════════════════════════════╝\n');
    
    console.log('📋 TURMAS CRIADAS:');
    for (const turma of turmasCreated) {
      const qtdAlunos = alunosCriados.filter(a => a.turma.toString() === turma._id.toString()).length;
      console.log(`   - ${turma.nome} (${turma.turno}) - ${qtdAlunos} alunos`);
    }
    
    console.log('\n✨ Acesse http://localhost:3000 para começar!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERRO ao popular banco:', error);
    console.error(error.stack);
    process.exit(1);
  }
};

// Executar seed
seedDatabase();
