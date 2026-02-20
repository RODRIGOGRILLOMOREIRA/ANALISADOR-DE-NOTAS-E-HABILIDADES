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

// @desc    Gerar template de alunos por turma
// @route   GET /api/alunos/template/:turmaId
exports.gerarTemplatePorTurma = async (req, res) => {
  try {
    const { turmaId } = req.params;
    const Turma = require('../models/Turma');
    
    // Validar ID da turma
    if (!turmaId || turmaId === 'undefined' || turmaId === 'null') {
      return res.status(400).json({ message: 'ID da turma inválido' });
    }
    
    // Buscar turma
    const turma = await Turma.findById(turmaId);
    if (!turma) {
      return res.status(404).json({ message: 'Turma não encontrada' });
    }
    
    // Gerar template vazio com estrutura correta para a turma
    // Incluir alguns exemplos para orientação
    const template = [
      {
        nome: 'João Silva',
        matricula: '',
        dataNascimento: '2010-05-15',
        turma: turma.nome,
        responsavel_nome: 'Maria Silva',
        responsavel_telefone: '(11) 98765-4321',
        responsavel_email: 'maria@email.com'
      },
      {
        nome: 'Ana Santos',
        matricula: '',
        dataNascimento: '2011-08-20',
        turma: turma.nome,
        responsavel_nome: 'Carlos Santos',
        responsavel_telefone: '(11) 91234-5678',
        responsavel_email: 'carlos@email.com'
      },
      {
        nome: '',
        matricula: '',
        dataNascimento: '',
        turma: turma.nome,
        responsavel_nome: '',
        responsavel_telefone: '',
        responsavel_email: ''
      }
    ];
    
    res.json({
      turma: {
        id: turma._id,
        nome: turma.nome,
        ano: turma.ano,
        serie: turma.serie,
        turno: turma.turno,
        capacidadeMaxima: turma.capacidadeMaxima
      },
      template,
      instrucoes: {
        turma: `Campo turma já está preenchido com "${turma.nome}"`,
        matricula: 'Matrícula será gerada automaticamente se deixada em branco',
        dataNascimento: 'Formato: AAAA-MM-DD (ex: 2010-05-15)',
        responsavel: 'Preencha todos os dados do responsável',
        dica: 'As 2 primeiras linhas são exemplos. Você pode apagá-las e preencher seus dados'
      }
    });
    
  } catch (error) {
    console.error('Erro ao gerar template de alunos:', error);
    res.status(500).json({ message: 'Erro ao gerar template', error: error.message });
  }
};
