const mongoose = require('mongoose');

const alunoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    index: true
  },
  matricula: {
    type: String,
    required: [true, 'Matrícula é obrigatória'],
    unique: true,
    trim: true,
    uppercase: true,
    index: true
  },
  dataNascimento: {
    type: Date,
    index: true
  },
  responsavel: {
    nome: String,
    telefone: String,
    email: {
      type: String,
      lowercase: true,
      trim: true
    }
  },
  turma: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Turma',
    index: true
  },
  ativo: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

// Índices compostos para queries frequentes
alunoSchema.index({ turma: 1, ativo: 1 });
alunoSchema.index({ nome: 1, ativo: 1 });
alunoSchema.index({ matricula: 1, ativo: 1 });

// Virtual para calcular idade
alunoSchema.virtual('idade').get(function() {
  if (!this.dataNascimento) return null;
  const hoje = new Date();
  const nascimento = new Date(this.dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
});

// Incluir virtuals no JSON
alunoSchema.set('toJSON', { virtuals: true });
alunoSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Aluno', alunoSchema);
