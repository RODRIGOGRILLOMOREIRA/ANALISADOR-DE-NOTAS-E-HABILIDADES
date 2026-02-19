const Habilidade = require('../models/Habilidade');

// @desc    Listar habilidades
// @route   GET /api/habilidades
exports.getHabilidades = async (req, res) => {
  try {
    const { disciplina, turma, ano, trimestre } = req.query;
    const filter = { ativo: true };
    
    if (disciplina) filter.disciplina = disciplina;
    if (turma) filter.turma = turma;
    if (ano) filter.ano = ano;
    if (trimestre) filter.trimestre = trimestre;
    
    const habilidades = await Habilidade.find(filter)
      .populate('disciplina', 'nome codigo')
      .populate('turma', 'nome')
      .populate('alunosDesempenho.aluno', 'nome matricula');
    
    res.json(habilidades);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar habilidades', error: error.message });
  }
};

// @desc    Buscar habilidade por ID
// @route   GET /api/habilidades/:id
exports.getHabilidadeById = async (req, res) => {
  try {
    const habilidade = await Habilidade.findById(req.params.id)
      .populate('disciplina')
      .populate('turma')
      .populate('alunosDesempenho.aluno');
    
    if (!habilidade) {
      return res.status(404).json({ message: 'Habilidade não encontrada' });
    }
    res.json(habilidade);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar habilidade', error: error.message });
  }
};

// @desc    Criar habilidade
// @route   POST /api/habilidades
exports.createHabilidade = async (req, res) => {
  try {
    const habilidade = await Habilidade.create(req.body);
    res.status(201).json(habilidade);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar habilidade', error: error.message });
  }
};

// @desc    Atualizar desempenho de aluno em habilidade
// @route   PUT /api/habilidades/:id/desempenho
exports.updateDesempenhoAluno = async (req, res) => {
  try {
    const { alunoId, nivel, observacao } = req.body;
    const habilidade = await Habilidade.findById(req.params.id);
    
    if (!habilidade) {
      return res.status(404).json({ message: 'Habilidade não encontrada' });
    }
    
    // Verificar se aluno já tem desempenho registrado
    const index = habilidade.alunosDesempenho.findIndex(
      ad => ad.aluno.toString() === alunoId
    );
    
    if (index > -1) {
      // Atualizar existente
      habilidade.alunosDesempenho[index].nivel = nivel;
      habilidade.alunosDesempenho[index].observacao = observacao;
    } else {
      // Adicionar novo
      habilidade.alunosDesempenho.push({
        aluno: alunoId,
        nivel,
        observacao
      });
    }
    
    await habilidade.save();
    res.json(habilidade);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar desempenho', error: error.message });
  }
};

// @desc    Atualizar habilidade
// @route   PUT /api/habilidades/:id
exports.updateHabilidade = async (req, res) => {
  try {
    const habilidade = await Habilidade.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!habilidade) {
      return res.status(404).json({ message: 'Habilidade não encontrada' });
    }
    res.json(habilidade);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar habilidade', error: error.message });
  }
};

// @desc    Deletar habilidade
// @route   DELETE /api/habilidades/:id
exports.deleteHabilidade = async (req, res) => {
  try {
    const habilidade = await Habilidade.findByIdAndUpdate(
      req.params.id,
      { ativo: false },
      { new: true }
    );
    
    if (!habilidade) {
      return res.status(404).json({ message: 'Habilidade não encontrada' });
    }
    res.json({ message: 'Habilidade desativada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar habilidade', error: error.message });
  }
};

// @desc    Gerar relatório de desenvolvimento por turma
// @route   GET /api/habilidades/relatorio/turma/:turmaId
exports.getRelatorioPorTurma = async (req, res) => {
  try {
    const { turmaId } = req.params;
    const { ano, trimestre } = req.query;

    const filter = { turma: turmaId, ativo: true };
    if (ano) filter.ano = ano;
    if (trimestre) filter.trimestre = trimestre;

    const habilidades = await Habilidade.find(filter)
      .populate('disciplina', 'nome codigo')
      .populate('alunosDesempenho.aluno', 'nome matricula');

    // Estatísticas gerais
    const stats = {
      totalHabilidades: habilidades.length,
      totalAcompanhamentos: 0,
      porNivel: {
        'nao-desenvolvido': 0,
        'em-desenvolvimento': 0,
        'desenvolvido': 0,
        'plenamente-desenvolvido': 0
      },
      porDisciplina: {}
    };

    habilidades.forEach(hab => {
      hab.alunosDesempenho.forEach(ad => {
        stats.totalAcompanhamentos++;
        stats.porNivel[ad.nivel]++;

        const discNome = hab.disciplina?.nome || 'Sem disciplina';
        if (!stats.porDisciplina[discNome]) {
          stats.porDisciplina[discNome] = {
            total: 0,
            'nao-desenvolvido': 0,
            'em-desenvolvimento': 0,
            'desenvolvido': 0,
            'plenamente-desenvolvido': 0
          };
        }
        stats.porDisciplina[discNome].total++;
        stats.porDisciplina[discNome][ad.nivel]++;
      });
    });

    res.json({
      habilidades,
      estatisticas: stats
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar relatório', error: error.message });
  }
};

// @desc    Buscar habilidades por aluno
// @route   GET /api/habilidades/aluno/:alunoId
exports.getHabilidadesPorAluno = async (req, res) => {
  try {
    const { alunoId } = req.params;
    const { ano, trimestre, turma } = req.query;

    const filter = { 
      ativo: true,
      'alunosDesempenho.aluno': alunoId 
    };
    
    if (ano) filter.ano = ano;
    if (trimestre) filter.trimestre = trimestre;
    if (turma) filter.turma = turma;

    const habilidades = await Habilidade.find(filter)
      .populate('disciplina', 'nome codigo')
      .populate('turma', 'nome')
      .populate('alunosDesempenho.aluno', 'nome matricula');

    // Filtrar apenas o desempenho do aluno específico e preparar resposta
    const habilidadesAluno = habilidades.map(hab => {
      const desempenhoAluno = hab.alunosDesempenho.find(
        ad => ad.aluno._id.toString() === alunoId
      );

      return {
        _id: hab._id,
        codigo: hab.codigo,
        descricao: hab.descricao,
        disciplina: hab.disciplina,
        turma: hab.turma,
        ano: hab.ano,
        trimestre: hab.trimestre,
        nivel: desempenhoAluno?.nivel || 'em-desenvolvimento',
        observacao: desempenhoAluno?.observacao || '',
        dataAtualizacao: hab.updatedAt
      };
    });

    // Estatísticas do aluno
    const stats = {
      total: habilidadesAluno.length,
      porNivel: {
        'nao-desenvolvido': 0,
        'em-desenvolvimento': 0,
        'desenvolvido': 0,
        'plenamente-desenvolvido': 0
      },
      porDisciplina: {},
      porTrimestre: {
        1: 0,
        2: 0,
        3: 0
      }
    };

    habilidadesAluno.forEach(hab => {
      stats.porNivel[hab.nivel]++;
      stats.porTrimestre[hab.trimestre]++;

      const discNome = hab.disciplina?.nome || 'Sem disciplina';
      if (!stats.porDisciplina[discNome]) {
        stats.porDisciplina[discNome] = {
          total: 0,
          'nao-desenvolvido': 0,
          'em-desenvolvimento': 0,
          'desenvolvido': 0,
          'plenamente-desenvolvido': 0
        };
      }
      stats.porDisciplina[discNome].total++;
      stats.porDisciplina[discNome][hab.nivel]++;
    });

    res.json({
      habilidades: habilidadesAluno,
      estatisticas: stats
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar habilidades do aluno', error: error.message });
  }
};
