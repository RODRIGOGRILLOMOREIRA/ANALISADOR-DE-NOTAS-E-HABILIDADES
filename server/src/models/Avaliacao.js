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
    required: false,
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
      enum: ['prova', 'trabalho', 'participacao', 'simulado', 'atividade', 'seminario', 'projeto', 'pesquisa', 'outro'],
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

  // SOMA SIMPLES de todas as notas (sem divisão, sem pesos)
  let somaNotas = 0;

  this.avaliacoes.forEach(av => {
    somaNotas += av.nota;
  });

  this.notaTrimestre = parseFloat(somaNotas.toFixed(2));
  return this.notaTrimestre;
};

// Hook para calcular nota antes de salvar
avaliacaoSchema.pre('save', function(next) {
  // Calcular soma das notas
  let somaNotas = 0;
  if (this.avaliacoes && this.avaliacoes.length > 0) {
    this.avaliacoes.forEach(av => {
      somaNotas += av.nota;
    });
  }
  
  // Validar limite
  if (somaNotas > 10) {
    return next(new Error(`A soma das notas (${somaNotas.toFixed(2)}) ultrapassou o limite de 10.0 pontos. Ajuste as notas.`));
  }
  
  this.calcularNotaTrimestre();
  next();
});

module.exports = mongoose.model('Avaliacao', avaliacaoSchema);
