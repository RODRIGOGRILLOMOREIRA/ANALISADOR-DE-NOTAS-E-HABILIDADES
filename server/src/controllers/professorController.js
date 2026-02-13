const Professor = require('../models/Professor');
const { paginate, paginatedResponse } = require('../utils/helpers');

// @desc    Listar todos os professores com paginação
// @route   GET /api/professores
exports.getProfessores = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const { skip, limit: limitNum } = paginate(page, limit);

    // Filtro de busca
    const filter = { ativo: true };
    if (search) {
      filter.$or = [
        { nome: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const [professores, total] = await Promise.all([
      Professor.find(filter)
        .populate('disciplinas', 'nome codigo')
        .populate('user', 'nome email tipo')
        .skip(skip)
        .limit(limitNum)
        .sort({ nome: 1 })
        .lean(),
      Professor.countDocuments(filter)
    ]);
    
    res.json(paginatedResponse(professores, page, limitNum, total));
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar professores', error: error.message });
  }
};

// @desc    Buscar professor por ID
// @route   GET /api/professores/:id
exports.getProfessorById = async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.id)
      .populate('disciplinas')
      .populate('user');
    
    if (!professor) {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }
    
    res.json(professor);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar professor', error: error.message });
  }
};

// @desc    Criar novo professor
// @route   POST /api/professores
exports.createProfessor = async (req, res) => {
  try {
    const professor = await Professor.create(req.body);
    res.status(201).json(professor);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar professor', error: error.message });
  }
};

// @desc    Atualizar professor
// @route   PUT /api/professores/:id
exports.updateProfessor = async (req, res) => {
  try {
    const professor = await Professor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!professor) {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }
    
    res.json(professor);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar professor', error: error.message });
  }
};

// @desc    Deletar professor (soft delete)
// @route   DELETE /api/professores/:id
exports.deleteProfessor = async (req, res) => {
  try {
    const professor = await Professor.findByIdAndUpdate(
      req.params.id,
      { ativo: false },
      { new: true }
    );
    
    if (!professor) {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }
    
    res.json({ message: 'Professor desativado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar professor', error: error.message });
  }
};
