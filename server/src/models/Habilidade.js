const mongoose = require('mongoose');

const habilidadeSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: [true, 'Código da habilidade é obrigatório'],
    trim: true
  },
  descricao: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true
  },
  disciplina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disciplina',
    required: true
  },
  ano: {
    type: Number,
    required: true
  },
  trimestre: {
    type: Number,
    required: true,
    enum: [1, 2, 3]
  },
  turma: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Turma',
    required: true
  },
  alunosDesempenho: [{
    aluno: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Aluno'
    },
    nivel: {
      type: String,
      enum: ['nao-desenvolvido', 'em-desenvolvimento', 'desenvolvido', 'plenamente-desenvolvido'],
      default: 'em-desenvolvimento'
    },
    observacao: String
  }],
  ativo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Habilidade', habilidadeSchema);
