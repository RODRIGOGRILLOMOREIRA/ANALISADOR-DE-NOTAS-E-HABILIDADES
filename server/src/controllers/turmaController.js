const Turma = require('../models/Turma');
const { paginate, paginatedResponse } = require('../utils/helpers');

exports.getTurmas = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, ano, serie, turno } = req.query;
    const { skip, limitNum, pageNum } = paginate(page, limit);

    // Filtros
    const filter = { ativo: true };
    if (search) {
      filter.nome = { $regex: search, $options: 'i' };
    }
    if (ano) filter.ano = parseInt(ano);
    if (serie) filter.serie = serie;
    if (turno) filter.turno = turno;

    const [turmas, total] = await Promise.all([
      Turma.find(filter)
        .populate('disciplinas.disciplina', 'nome codigo')
        .populate('disciplinas.professor', 'nome')
        .populate('alunos', 'nome matricula')
        .sort({ ano: -1, serie: 1 })
        .skip(skip)
        .limit(limitNum),
      Turma.countDocuments(filter)
    ]);

    res.json(paginatedResponse(turmas, pageNum, limitNum, total));
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar turmas', error: error.message });
  }
};

exports.getTurmaById = async (req, res) => {
  try {
    const turma = await Turma.findById(req.params.id)
      .populate('disciplinas.disciplina')
      .populate('disciplinas.professor')
      .populate('alunos');
    
    if (!turma) {
      return res.status(404).json({ message: 'Turma não encontrada' });
    }
    res.json(turma);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar turma', error: error.message });
  }
};

exports.createTurma = async (req, res) => {
  try {
    const turma = await Turma.create(req.body);
    res.status(201).json(turma);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar turma', error: error.message });
  }
};

exports.updateTurma = async (req, res) => {
  try {
    const turma = await Turma.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!turma) {
      return res.status(404).json({ message: 'Turma não encontrada' });
    }
    res.json(turma);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar turma', error: error.message });
  }
};

exports.deleteTurma = async (req, res) => {
  try {
    const turma = await Turma.findByIdAndUpdate(
      req.params.id,
      { ativo: false },
      { new: true }
    );
    if (!turma) {
      return res.status(404).json({ message: 'Turma não encontrada' });
    }
    res.json({ message: 'Turma desativada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar turma', error: error.message });
  }
};
