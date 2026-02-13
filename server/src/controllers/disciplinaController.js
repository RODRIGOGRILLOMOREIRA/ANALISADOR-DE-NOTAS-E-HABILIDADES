const Disciplina = require('../models/Disciplina');
const { paginate, paginatedResponse } = require('../utils/helpers');

exports.getDisciplinas = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const { skip, limitNum, pageNum } = paginate(page, limit);

    // Filtro de busca
    const filter = { ativo: true };
    if (search) {
      filter.$or = [
        { nome: { $regex: search, $options: 'i' } },
        { codigo: { $regex: search.toUpperCase(), $options: 'i' } }
      ];
    }

    const [disciplinas, total] = await Promise.all([
      Disciplina.find(filter)
        .sort({ nome: 1 })
        .skip(skip)
        .limit(limitNum),
      Disciplina.countDocuments(filter)
    ]);

    res.json(paginatedResponse(disciplinas, pageNum, limitNum, total));
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar disciplinas', error: error.message });
  }
};

exports.getDisciplinaById = async (req, res) => {
  try {
    const disciplina = await Disciplina.findById(req.params.id);
    if (!disciplina) {
      return res.status(404).json({ message: 'Disciplina não encontrada' });
    }
    res.json(disciplina);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar disciplina', error: error.message });
  }
};

exports.createDisciplina = async (req, res) => {
  try {
    const disciplina = await Disciplina.create(req.body);
    res.status(201).json(disciplina);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar disciplina', error: error.message });
  }
};

exports.updateDisciplina = async (req, res) => {
  try {
    const disciplina = await Disciplina.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!disciplina) {
      return res.status(404).json({ message: 'Disciplina não encontrada' });
    }
    res.json(disciplina);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar disciplina', error: error.message });
  }
};

exports.deleteDisciplina = async (req, res) => {
  try {
    const disciplina = await Disciplina.findByIdAndUpdate(
      req.params.id,
      { ativo: false },
      { new: true }
    );
    if (!disciplina) {
      return res.status(404).json({ message: 'Disciplina não encontrada' });
    }
    res.json({ message: 'Disciplina desativada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar disciplina', error: error.message });
  }
};
