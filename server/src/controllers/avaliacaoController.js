const Avaliacao = require('../models/Avaliacao');
const { paginate, paginatedResponse } = require('../utils/helpers');

// @desc    Listar avaliações com filtros
// @route   GET /api/avaliacoes
exports.getAvaliacoes = async (req, res) => {
  try {
    const { page = 1, limit = 20, aluno, turma, disciplina, ano, trimestre } = req.query;
    const { skip, limitNum, pageNum } = paginate(page, limit);
    
    const filter = {};
    if (aluno) filter.aluno = aluno;
    if (turma) filter.turma = turma;
    if (disciplina) filter.disciplina = disciplina;
    if (ano) filter.ano = parseInt(ano);
    if (trimestre) filter.trimestre = parseInt(trimestre);
    
    const [avaliacoes, total] = await Promise.all([
      Avaliacao.find(filter)
        .populate('aluno', 'nome matricula')
        .populate('disciplina', 'nome codigo')
        .populate('turma', 'nome')
        .populate('professor', 'nome')
        .sort({ ano: -1, trimestre: -1 })
        .skip(skip)
        .limit(limitNum),
      Avaliacao.countDocuments(filter)
    ]);
    
    res.json(paginatedResponse(avaliacoes, pageNum, limitNum, total));
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar avaliações', error: error.message });
  }
};

// @desc    Buscar avaliação por ID
// @route   GET /api/avaliacoes/:id
exports.getAvaliacaoById = async (req, res) => {
  try {
    const avaliacao = await Avaliacao.findById(req.params.id)
      .populate('aluno')
      .populate('disciplina')
      .populate('turma')
      .populate('professor');
    
    if (!avaliacao) {
      return res.status(404).json({ message: 'Avaliação não encontrada' });
    }
    res.json(avaliacao);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar avaliação', error: error.message });
  }
};

// @desc    Criar ou atualizar avaliação
// @route   POST /api/avaliacoes
exports.createAvaliacao = async (req, res) => {
  try {
    const { aluno, disciplina, turma, ano, trimestre } = req.body;
    
    // Verificar se já existe avaliação para este aluno/disciplina/trimestre
    let avaliacao = await Avaliacao.findOne({
      aluno,
      disciplina,
      turma,
      ano,
      trimestre
    });
    
    if (avaliacao) {
      // Atualizar existente
      avaliacao = await Avaliacao.findByIdAndUpdate(
        avaliacao._id,
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      // Criar nova
      avaliacao = await Avaliacao.create(req.body);
    }
    
    res.status(201).json(avaliacao);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar avaliação', error: error.message });
  }
};

// @desc    Adicionar nota a uma avaliação existente
// @route   POST /api/avaliacoes/:id/notas
exports.adicionarNota = async (req, res) => {
  try {
    const avaliacao = await Avaliacao.findById(req.params.id);
    
    if (!avaliacao) {
      return res.status(404).json({ message: 'Avaliação não encontrada' });
    }
    
    avaliacao.avaliacoes.push(req.body);
    await avaliacao.save();
    
    res.json(avaliacao);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao adicionar nota', error: error.message });
  }
};

// @desc    Calcular média anual do aluno
// @route   GET /api/avaliacoes/aluno/:alunoId/media-anual
exports.getMediaAnual = async (req, res) => {
  try {
    const { alunoId } = req.params;
    const { disciplina, ano } = req.query;
    
    const avaliacoes = await Avaliacao.find({
      aluno: alunoId,
      disciplina,
      ano,
      trimestre: { $in: [1, 2, 3] }
    }).sort({ trimestre: 1 });
    
    if (avaliacoes.length === 0) {
      return res.json({ mediaAnual: 0, avaliacoes: [] });
    }
    
    let somaNotas = 0;
    let trimestresComNota = 0;
    
    avaliacoes.forEach(av => {
      if (av.notaTrimestre !== null && av.notaTrimestre !== undefined) {
        somaNotas += av.notaTrimestre;
        trimestresComNota++;
      }
    });
    
    const mediaAnual = trimestresComNota > 0 
      ? (somaNotas / trimestresComNota).toFixed(2)
      : 0;
    
    res.json({
      mediaAnual,
      avaliacoes: avaliacoes.map(av => ({
        trimestre: av.trimestre,
        notaTrimestre: av.notaTrimestre,
        avaliacoes: av.avaliacoes
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao calcular média anual', error: error.message });
  }
};

// @desc    Atualizar avaliação
// @route   PUT /api/avaliacoes/:id
exports.updateAvaliacao = async (req, res) => {
  try {
    const avaliacao = await Avaliacao.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!avaliacao) {
      return res.status(404).json({ message: 'Avaliação não encontrada' });
    }
    res.json(avaliacao);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar avaliação', error: error.message });
  }
};

// @desc    Deletar avaliação
// @route   DELETE /api/avaliacoes/:id
exports.deleteAvaliacao = async (req, res) => {
  try {
    const avaliacao = await Avaliacao.findByIdAndDelete(req.params.id);
    
    if (!avaliacao) {
      return res.status(404).json({ message: 'Avaliação não encontrada' });
    }
    res.json({ message: 'Avaliação deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar avaliação', error: error.message });
  }
};
