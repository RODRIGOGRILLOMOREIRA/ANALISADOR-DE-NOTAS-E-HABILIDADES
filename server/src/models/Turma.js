const mongoose = require('mongoose');

const turmaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome da turma é obrigatório'],
    trim: true,
    index: true
  },
  ano: {
    type: Number,
    required: [true, 'Ano é obrigatório'],
    index: true,
    min: 2020,
    max: 2030
  },
  serie: {
    type: String,
    required: [true, 'Série é obrigatória'],
    trim: true,
    index: true
  },
  turno: {
    type: String,
    enum: ['matutino', 'vespertino', 'noturno', 'integral'],
    required: true,
    index: true
  },
  capacidadeMaxima: {
    type: Number,
    default: 35,
    min: 1,
    max: 50
  },
  disciplinas: [{
    disciplina: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Disciplina'
    },
    professor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Professor'
    }
  }],
  alunos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aluno'
  }],
  ativo: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

// Índices compostos
turmaSchema.index({ ano: 1, serie: 1, nome: 1 });
turmaSchema.index({ ano: 1, ativo: 1 });
turmaSchema.index({ serie: 1, turno: 1, ativo: 1 });

// Virtual para contar alunos
turmaSchema.virtual('totalAlunos').get(function() {
  return this.alunos ? this.alunos.length : 0;
});

// Virtual para verificar se está cheia
turmaSchema.virtual('estaCheia').get(function() {
  return this.totalAlunos >= this.capacidadeMaxima;
});

// Incluir virtuals
turmaSchema.set('toJSON', { virtuals: true });
turmaSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Turma', turmaSchema);
