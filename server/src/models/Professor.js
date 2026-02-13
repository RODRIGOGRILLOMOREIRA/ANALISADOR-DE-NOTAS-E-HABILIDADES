const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    index: true
  },
  telefone: {
    type: String,
    trim: true
  },
  disciplinas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disciplina'
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ativo: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

// Índices compostos para queries otimizadas
professorSchema.index({ ativo: 1, nome: 1 });
professorSchema.index({ email: 1, ativo: 1 });

module.exports = mongoose.model('Professor', professorSchema);
