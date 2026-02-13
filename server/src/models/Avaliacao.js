const mongoose = require('mongoose');

const avaliacaoSchema = new mongoose.Schema({
  aluno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aluno',
    required: true,
    index: true
  },
  disciplina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disciplina',
    required: true,
    index: true
  },
  turma: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Turma',
    required: true,
    index: true
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: true,
    index: true
  },
  ano: {
    type: Number,
    required: true,
    index: true,
    min: 2020,
    max: 2030
  },
  trimestre: {
    type: Number,
    required: true,
    enum: [1, 2, 3],
    min: 1,
    max: 3,
    index: true
  },
  avaliacoes: [{
    tipo: {
      type: String,
      enum: ['prova', 'trabalho', 'participacao', 'simulado', 'outro'],
      required: true
    },
    descricao: String,
    nota: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    peso: {
      type: Number,
      default: 1,
      min: 0.1
    },
    data: {
      type: Date,
      default: Date.now
    }
  }],
  notaTrimestre: {
    type: Number,
    min: 0,
    max: 10,
    index: true
  },
  observacoes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Índices compostos para queries otimizadas
avaliacaoSchema.index({ aluno: 1, disciplina: 1, ano: 1, trimestre: 1 }, { unique: true });
avaliacaoSchema.index({ turma: 1, disciplina: 1, ano: 1 });
avaliacaoSchema.index({ ano: 1, trimestre: 1 });
avaliacaoSchema.index({ notaTrimestre: 1, ano: 1 });

// Calcular nota do trimestre automaticamente
avaliacaoSchema.methods.calcularNotaTrimestre = function() {
  if (!this.avaliacoes || this.avaliacoes.length === 0) {
    return 0;
  }

  let somaNotas = 0;
  let somaPesos = 0;

  this.avaliacoes.forEach(av => {
    somaNotas += av.nota * av.peso;
    somaPesos += av.peso;
  });

  this.notaTrimestre = somaPesos > 0 ? parseFloat((somaNotas / somaPesos).toFixed(2)) : 0;
  return this.notaTrimestre;
};

// Hook para calcular nota antes de salvar
avaliacaoSchema.pre('save', function(next) {
  this.calcularNotaTrimestre();
  next();
});

module.exports = mongoose.model('Avaliacao', avaliacaoSchema);
