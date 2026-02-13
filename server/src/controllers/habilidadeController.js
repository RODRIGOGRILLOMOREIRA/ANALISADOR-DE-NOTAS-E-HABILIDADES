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
