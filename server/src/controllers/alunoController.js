const Aluno = require('../models/Aluno');
const { paginate, paginatedResponse } = require('../utils/helpers');

exports.getAlunos = async (req, res) => {
  try {
    const { turma, search, page = 1, limit = 50 } = req.query;
    const { skip, limit: limitNum } = paginate(page, limit);
    
    const filter = { ativo: true };
    
    if (turma) {
      filter.turma = turma;
    }

    if (search) {
      filter.$or = [
        { nome: { $regex: search, $options: 'i' } },
        { matricula: { $regex: search, $options: 'i' } }
      ];
    }
    
    const [alunos, total] = await Promise.all([
      Aluno.find(filter)
        .populate('turma', 'nome ano serie')
        .skip(skip)
        .limit(limitNum)
        .sort({ nome: 1 })
        .lean(),
      Aluno.countDocuments(filter)
    ]);
    
    res.json(paginatedResponse(alunos, page, limitNum, total));
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar alunos', error: error.message });
  }
};

exports.getAlunoById = async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id).populate('turma');
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    res.json(aluno);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar aluno', error: error.message });
  }
};

exports.createAluno = async (req, res) => {
  try {
    const aluno = await Aluno.create(req.body);
    
    // Adicionar aluno na turma
    if (aluno.turma) {
      const Turma = require('../models/Turma');
      await Turma.findByIdAndUpdate(
        aluno.turma,
        { $push: { alunos: aluno._id } }
      );
    }
    
    res.status(201).json(aluno);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar aluno', error: error.message });
  }
};

exports.updateAluno = async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    res.json(aluno);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar aluno', error: error.message });
  }
};

exports.deleteAluno = async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndUpdate(
      req.params.id,
      { ativo: false },
      { new: true }
    );
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    res.json({ message: 'Aluno desativado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar aluno', error: error.message });
  }
};
