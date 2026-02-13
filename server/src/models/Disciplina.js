const mongoose = require('mongoose');

const disciplinaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome da disciplina é obrigatório'],
    trim: true,
    index: true
  },
  codigo: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    uppercase: true
  },
  cargaHoraria: {
    type: Number,
    default: 0,
    min: 0
  },
  descricao: {
    type: String,
    trim: true
  },
  ativo: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

// Índices
disciplinaSchema.index({ ativo: 1, nome: 1 });
disciplinaSchema.index({ codigo: 1, ativo: 1 });

module.exports = mongoose.model('Disciplina', disciplinaSchema);
