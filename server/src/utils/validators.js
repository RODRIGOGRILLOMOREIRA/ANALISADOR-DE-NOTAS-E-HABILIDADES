const { body, param, query, validationResult } = require('express-validator');

// Middleware para validar resultados
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Erro de validação',
      errors: errors.array() 
    });
  }
  next();
};

// Validações para usuário
exports.validateUser = [
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 3 }).withMessage('Nome deve ter no mínimo 3 caracteres'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email é obrigatório')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  body('senha')
    .notEmpty().withMessage('Senha é obrigatória')
    .isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('tipo')
    .optional()
    .isIn(['admin', 'professor', 'coordenador']).withMessage('Tipo inválido')
];

// Validações para professor
exports.validateProfessor = [
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 3 }).withMessage('Nome deve ter no mínimo 3 caracteres'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email é obrigatório')
    .isEmail().withMessage('Email inválido'),
  body('telefone')
    .optional()
    .matches(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/).withMessage('Telefone inválido')
];

// Validações para disciplina
exports.validateDisciplina = [
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome da disciplina é obrigatório'),
  body('codigo')
    .optional()
    .trim()
    .isLength({ min: 2, max: 10 }).withMessage('Código deve ter entre 2 e 10 caracteres'),
  body('cargaHoraria')
    .optional()
    .isInt({ min: 1 }).withMessage('Carga horária deve ser maior que 0')
];

// Validações para turma
exports.validateTurma = [
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome da turma é obrigatório'),
  body('ano')
    .isInt({ min: 2020, max: 2030 }).withMessage('Ano inválido'),
  body('serie')
    .trim()
    .notEmpty().withMessage('Série é obrigatória'),
  body('turno')
    .isIn(['matutino', 'vespertino', 'noturno', 'integral']).withMessage('Turno inválido')
];

// Validações para aluno
exports.validateAluno = [
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 3 }).withMessage('Nome deve ter no mínimo 3 caracteres'),
  body('matricula')
    .trim()
    .notEmpty().withMessage('Matrícula é obrigatória')
    .isLength({ min: 4 }).withMessage('Matrícula deve ter no mínimo 4 caracteres'),
  body('dataNascimento')
    .optional()
    .isISO8601().withMessage('Data de nascimento inválida'),
  body('responsavel.email')
    .optional()
    .isEmail().withMessage('Email do responsável inválido')
];

// Validações para avaliação
exports.validateAvaliacao = [
  body('aluno')
    .notEmpty().withMessage('Aluno é obrigatório')
    .isMongoId().withMessage('ID do aluno inválido'),
  body('disciplina')
    .notEmpty().withMessage('Disciplina é obrigatória')
    .isMongoId().withMessage('ID da disciplina inválido'),
  body('turma')
    .notEmpty().withMessage('Turma é obrigatória')
    .isMongoId().withMessage('ID da turma inválido'),
  body('ano')
    .isInt({ min: 2020, max: 2030 }).withMessage('Ano inválido'),
  body('trimestre')
    .isInt({ min: 1, max: 3 }).withMessage('Trimestre deve ser 1, 2 ou 3'),
  body('avaliacoes.*.tipo')
    .isIn(['prova', 'trabalho', 'participacao', 'simulado', 'outro'])
    .withMessage('Tipo de avaliação inválido'),
  body('avaliacoes.*.nota')
    .isFloat({ min: 0, max: 10 }).withMessage('Nota deve estar entre 0 e 10'),
  body('avaliacoes.*.peso')
    .optional()
    .isFloat({ min: 0.1 }).withMessage('Peso deve ser maior que 0')
];

// Validações para habilidade
exports.validateHabilidade = [
  body('codigo')
    .trim()
    .notEmpty().withMessage('Código é obrigatório'),
  body('descricao')
    .trim()
    .notEmpty().withMessage('Descrição é obrigatória'),
  body('disciplina')
    .notEmpty().withMessage('Disciplina é obrigatória')
    .isMongoId().withMessage('ID da disciplina inválido'),
  body('ano')
    .isInt({ min: 2020, max: 2030 }).withMessage('Ano inválido'),
  body('trimestre')
    .isInt({ min: 1, max: 3 }).withMessage('Trimestre deve ser 1, 2 ou 3'),
  body('turma')
    .notEmpty().withMessage('Turma é obrigatória')
    .isMongoId().withMessage('ID da turma inválido')
];

// Validação de paginação
exports.validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Página deve ser maior que 0'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limite deve estar entre 1 e 100')
];
