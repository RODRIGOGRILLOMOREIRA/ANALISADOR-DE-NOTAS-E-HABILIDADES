const Avaliacao = require('../models/Avaliacao');
const Aluno = require('../models/Aluno');
const Habilidade = require('../models/Habilidade');

// @desc    Dashboard geral - estatísticas
// @route   GET /api/dashboard/estatisticas
exports.getEstatisticas = async (req, res) => {
  try {
    const { turma, aluno, disciplina, ano, trimestre, dataInicio, dataFim, pontoCorte } = req.query;
    
    const filter = {};
    if (turma) filter.turma = turma;
    if (aluno) filter.aluno = aluno;
    if (disciplina) filter.disciplina = disciplina;
    if (ano) filter.ano = ano;
    if (trimestre) filter.trimestre = trimestre;
    
    // Filtro por período específico
    if (dataInicio || dataFim) {
      filter.createdAt = {};
      if (dataInicio) filter.createdAt.$gte = new Date(dataInicio);
      if (dataFim) {
        const fimDate = new Date(dataFim);
        fimDate.setHours(23, 59, 59, 999); // Final do dia
        filter.createdAt.$lte = fimDate;
      }
    }
    
    const avaliacoes = await Avaliacao.find(filter);
    
    const corte = pontoCorte ? parseFloat(pontoCorte) : 6.0;
    
    let aprovados = 0;
    let reprovados = 0;
    let somaNotas = 0;
    let quantidade = 0;
    
    avaliacoes.forEach(av => {
      if (av.notaTrimestre !== null && av.notaTrimestre !== undefined) {
        somaNotas += av.notaTrimestre;
        quantidade++;
        
        if (av.notaTrimestre >= corte) {
          aprovados++;
        } else {
          reprovados++;
        }
      }
    });
    
    const media = quantidade > 0 ? (somaNotas / quantidade).toFixed(2) : 0;
    const percentualAprovacao = quantidade > 0 
      ? ((aprovados / quantidade) * 100).toFixed(2)
      : 0;
    
    res.json({
      totalAvaliacoes: quantidade,
      mediaGeral: parseFloat(media),
      aprovados,
      reprovados,
      percentualAprovacao: parseFloat(percentualAprovacao),
      pontoCorte: corte
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar estatísticas', error: error.message });
  }
};

// @desc    Dashboard - Desempenho por disciplina
// @route   GET /api/dashboard/desempenho-disciplina
exports.getDesempenhoPorDisciplina = async (req, res) => {
  try {
    const { turma, aluno, ano, trimestre, dataInicio, dataFim } = req.query;
    
    const filter = {};
    if (turma) filter.turma = turma;
    if (aluno) filter.aluno = aluno;
    if (ano) filter.ano = ano;
    if (trimestre) filter.trimestre = trimestre;
    
    // Filtro por período específico
    if (dataInicio || dataFim) {
      filter.createdAt = {};
      if (dataInicio) filter.createdAt.$gte = new Date(dataInicio);
      if (dataFim) {
        const fimDate = new Date(dataFim);
        fimDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = fimDate;
      }
    }
    
    const avaliacoes = await Avaliacao.find(filter)
      .populate('disciplina', 'nome codigo');
    
    const desempenhoPorDisciplina = {};
    
    avaliacoes.forEach(av => {
      const disciplinaId = av.disciplina._id.toString();
      const disciplinaNome = av.disciplina.nome;
      
      if (!desempenhoPorDisciplina[disciplinaId]) {
        desempenhoPorDisciplina[disciplinaId] = {
          disciplina: disciplinaNome,
          codigo: av.disciplina.codigo,
          somaNotas: 0,
          quantidade: 0,
          media: 0
        };
      }
      
      if (av.notaTrimestre !== null && av.notaTrimestre !== undefined) {
        desempenhoPorDisciplina[disciplinaId].somaNotas += av.notaTrimestre;
        desempenhoPorDisciplina[disciplinaId].quantidade++;
      }
    });
    
    // Calcular médias
    Object.keys(desempenhoPorDisciplina).forEach(key => {
      const disc = desempenhoPorDisciplina[key];
      disc.media = disc.quantidade > 0 
        ? parseFloat((disc.somaNotas / disc.quantidade).toFixed(2))
        : 0;
      delete disc.somaNotas;
      delete disc.quantidade;
    });
    
    res.json(Object.values(desempenhoPorDisciplina));
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar desempenho por disciplina', error: error.message });
  }
};

// @desc    Dashboard - Evolução trimestral
// @route   GET /api/dashboard/evolucao-trimestral
exports.getEvolucaoTrimestral = async (req, res) => {
  try {
    const { turma, aluno, disciplina, ano, dataInicio, dataFim } = req.query;
    
    const filter = { ano: ano || new Date().getFullYear() };
    if (turma) filter.turma = turma;
    if (aluno) filter.aluno = aluno;
    if (disciplina) filter.disciplina = disciplina;
    
    // Filtro por período específico
    if (dataInicio || dataFim) {
      filter.createdAt = {};
      if (dataInicio) filter.createdAt.$gte = new Date(dataInicio);
      if (dataFim) {
        const fimDate = new Date(dataFim);
        fimDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = fimDate;
      }
    }
    
    const evolucao = [];
    
    for (let trim = 1; trim <= 3; trim++) {
      filter.trimestre = trim;
      const avaliacoes = await Avaliacao.find(filter);
      
      let soma = 0;
      let count = 0;
      
      avaliacoes.forEach(av => {
        if (av.notaTrimestre !== null && av.notaTrimestre !== undefined) {
          soma += av.notaTrimestre;
          count++;
        }
      });
      
      evolucao.push({
        trimestre: trim,
        media: count > 0 ? parseFloat((soma / count).toFixed(2)) : 0,
        totalAlunos: count
      });
    }
    
    res.json(evolucao);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar evolução trimestral', error: error.message });
  }
};

// @desc    Dashboard - Alunos em risco
// @route   GET /api/dashboard/alunos-risco
exports.getAlunosEmRisco = async (req, res) => {
  try {
    const { turma, aluno, ano, dataInicio, dataFim, pontoCorte } = req.query;
    const corte = pontoCorte ? parseFloat(pontoCorte) : 6.0;
    
    const filter = {
      ano: ano || new Date().getFullYear(),
      notaTrimestre: { $lt: corte }
    };
    
    if (turma) filter.turma = turma;
    if (aluno) filter.aluno = aluno;
    
    // Filtro por período específico
    if (dataInicio || dataFim) {
      filter.createdAt = {};
      if (dataInicio) filter.createdAt.$gte = new Date(dataInicio);
      if (dataFim) {
        const fimDate = new Date(dataFim);
        fimDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = fimDate;
      }
    }
    
    const avaliacoes = await Avaliacao.find(filter)
      .populate('aluno', 'nome matricula')
      .populate('disciplina', 'nome')
      .sort({ notaTrimestre: 1 });
    
    const alunosEmRisco = [];
    const alunosMap = {};
    
    avaliacoes.forEach(av => {
      const alunoId = av.aluno._id.toString();
      
      if (!alunosMap[alunoId]) {
        alunosMap[alunoId] = {
          aluno: av.aluno,
          disciplinasComDificuldade: []
        };
      }
      
      alunosMap[alunoId].disciplinasComDificuldade.push({
        disciplina: av.disciplina.nome,
        trimestre: av.trimestre,
        nota: av.notaTrimestre
      });
    });
    
    res.json(Object.values(alunosMap));
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar alunos em risco', error: error.message });
  }
};

// @desc    Dashboard - Habilidades desenvolvidas
// @route   GET /api/dashboard/habilidades-desenvolvidas
exports.getHabilidadesDesenvolvidas = async (req, res) => {
  try {
    const { turma, disciplina, ano, trimestre } = req.query;
    
    const filter = { ativo: true };
    if (turma) filter.turma = turma;
    if (disciplina) filter.disciplina = disciplina;
    if (ano) filter.ano = ano;
    if (trimestre) filter.trimestre = trimestre;
    
    const habilidades = await Habilidade.find(filter)
      .populate('disciplina', 'nome');
    
    const estatisticas = {
      'nao-desenvolvido': 0,
      'em-desenvolvimento': 0,
      'desenvolvido': 0,
      'plenamente-desenvolvido': 0
    };
    
    habilidades.forEach(hab => {
      hab.alunosDesempenho.forEach(ad => {
        estatisticas[ad.nivel]++;
      });
    });
    
    res.json(estatisticas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar habilidades desenvolvidas', error: error.message });
  }
};

// @desc    Dashboard - Evolução de habilidades por avaliações
// @route   GET /api/dashboard/evolucao-habilidades
exports.getEvolucaoHabilidades = async (req, res) => {
  try {
    const { turma, aluno, disciplina, ano } = req.query;
    
    const filter = {};
    if (turma) filter.turma = turma;
    if (aluno) filter.aluno = aluno;
    if (disciplina) filter.disciplina = disciplina;
    if (ano) filter.ano = parseInt(ano) || new Date().getFullYear();
    
    const avaliacoes = await Avaliacao.find(filter)
      .populate('avaliacoes.habilidades.habilidade', 'codigo descricao')
      .populate('aluno', 'nome matricula')
      .sort({ trimestre: 1 });
    
    const niveisValor = {
      'nao-desenvolvido': 0,
      'em-desenvolvimento': 1,
      'desenvolvido': 2,
      'plenamente-desenvolvido': 3
    };
    
    // Agrupar por trimestre
    const evolucaoPorTrimestre = {
      1: { total: 0, soma: 0, media: 0 },
      2: { total: 0, soma: 0, media: 0 },
      3: { total: 0, soma: 0, media: 0 }
    };
    
    avaliacoes.forEach(av => {
      av.avaliacoes.forEach(item => {
        if (item.habilidades && item.habilidades.length > 0) {
          item.habilidades.forEach(hab => {
            const valor = niveisValor[hab.nivel] || 0;
            evolucaoPorTrimestre[av.trimestre].soma += valor;
            evolucaoPorTrimestre[av.trimestre].total++;
          });
        }
      });
    });
    
    // Calcular médias e percentuais
    Object.keys(evolucaoPorTrimestre).forEach(trimestre => {
      const data = evolucaoPorTrimestre[trimestre];
      if (data.total > 0) {
        data.media = (data.soma / data.total).toFixed(2);
        data.percentual = ((data.soma / (data.total * 3)) * 100).toFixed(1); // 3 é o valor máximo
      } else {
        data.media = 0;
        data.percentual = 0;
      }
    });
    
    res.json(evolucaoPorTrimestre);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar evolução de habilidades', error: error.message });
  }
};

// @desc    Dashboard - Distribuição de níveis de habilidades
// @route   GET /api/dashboard/distribuicao-niveis-habilidades
exports.getDistribuicaoNiveisHabilidades = async (req, res) => {
  try {
    const { turma, disciplina, ano, trimestre } = req.query;
    
    const filter = {};
    if (turma) filter.turma = turma;
    if (disciplina) filter.disciplina = disciplina;
    if (ano) filter.ano = parseInt(ano) || new Date().getFullYear();
    if (trimestre) filter.trimestre = parseInt(trimestre);
    
    const avaliacoes = await Avaliacao.find(filter)
      .populate('avaliacoes.habilidades.habilidade', 'codigo descricao');
    
    const distribuicao = {
      'nao-desenvolvido': 0,
      'em-desenvolvimento': 0,
      'desenvolvido': 0,
      'plenamente-desenvolvido': 0
    };
    
    let totalHabilidades = 0;
    
    avaliacoes.forEach(av => {
      av.avaliacoes.forEach(item => {
        if (item.habilidades && item.habilidades.length > 0) {
          item.habilidades.forEach(hab => {
            distribuicao[hab.nivel]++;
            totalHabilidades++;
          });
        }
      });
    });
    
    // Calcular percentuais
    const distribuicaoPercentual = {};
    Object.keys(distribuicao).forEach(nivel => {
      distribuicaoPercentual[nivel] = {
        quantidade: distribuicao[nivel],
        percentual: totalHabilidades > 0 
          ? ((distribuicao[nivel] / totalHabilidades) * 100).toFixed(1)
          : 0
      };
    });
    
    res.json({
      total: totalHabilidades,
      distribuicao: distribuicaoPercentual
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar distribuição de níveis', error: error.message });
  }
};

// @desc    Contagem de alunos (total da escola ou por turma)
// @route   GET /api/dashboard/contagem-alunos
exports.getContagemAlunos = async (req, res) => {
  try {
    const { turma } = req.query;
    
    console.log('📊 Buscando contagem de alunos:', { turma });
    
    const filter = {};
    if (turma) {
      filter.turma = turma;
    }
    
    const totalAlunos = await Aluno.countDocuments(filter);
    
    const contexto = turma ? 'da turma' : 'da escola';
    console.log(`✅ Total de alunos ${contexto}: ${totalAlunos}`);
    
    res.json({
      totalAlunos,
      turma: turma || null,
      contexto
    });
  } catch (error) {
    console.error('❌ Erro ao buscar contagem de alunos:', error);
    res.status(500).json({ message: 'Erro ao buscar contagem de alunos', error: error.message });
  }
};
