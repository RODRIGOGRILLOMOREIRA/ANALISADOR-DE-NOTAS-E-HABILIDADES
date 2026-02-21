const mongoose = require('mongoose');

const frequenciaSchema = new mongoose.Schema({
  aluno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aluno',
    required: [true, 'Aluno é obrigatório'],
    index: true
  },
  turma: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Turma',
    required: [true, 'Turma é obrigatória'],
    index: true
  },
  disciplina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disciplina',
    required: [true, 'Disciplina é obrigatória'],
    index: true
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: false,
    default: null
  },
  data: {
    type: Date,
    required: [true, 'Data é obrigatória'],
    index: true
  },
  status: {
    type: String,
    enum: ['presente', 'falta', 'falta-justificada', 'atestado'],
    default: 'presente',
    index: true
  },
  observacao: {
    type: String,
    maxlength: 500
  },
  justificativa: {
    descricao: String,
    anexo: String, // URL do documento se houver
    dataJustificativa: Date
  },
  periodo: {
    type: String,
    enum: ['matutino', 'vespertino', 'noturno', 'integral'],
    required: true
  },
  // Metadados
  ano: {
    type: Number,
    required: true,
    default: () => new Date().getFullYear(),
    index: true
  },
  mes: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
    index: true,
    default: function() {
      return this.data ? new Date(this.data).getMonth() + 1 : new Date().getMonth() + 1;
    }
  },
  trimestre: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
    index: true,
    default: function() {
      const mes = this.data ? new Date(this.data).getMonth() + 1 : new Date().getMonth() + 1;
      if (mes <= 3) return 1;
      else if (mes <= 6) return 2;
      else if (mes <= 9) return 3;
      else return 4;
    }
  },
  registradoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ativo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índice composto para buscar frequência única por dia/aluno/disciplina
frequenciaSchema.index({ aluno: 1, disciplina: 1, data: 1 }, { unique: true });

// Índice para consultas de dashboard
frequenciaSchema.index({ turma: 1, data: 1, status: 1 });
frequenciaSchema.index({ aluno: 1, ano: 1, trimestre: 1, status: 1 });

// Middleware para calcular mês e trimestre antes de salvar
frequenciaSchema.pre('save', function(next) {
  if (this.data) {
    const data = new Date(this.data);
    this.mes = data.getMonth() + 1; // 1-12
    
    // Calcular trimestre (assumindo ano letivo normal)
    if (this.mes <= 3) this.trimestre = 1;
    else if (this.mes <= 6) this.trimestre = 2;
    else if (this.mes <= 9) this.trimestre = 3;
    else this.trimestre = 4;
  }
  next();
});

// Métodos estáticos úteis

// Calcular percentual de presença de um aluno
frequenciaSchema.statics.calcularPresenca = async function(alunoId, filtros = {}) {
  const query = { aluno: alunoId, ativo: true, ...filtros };
  
  const [total, presencas] = await Promise.all([
    this.countDocuments(query),
    this.countDocuments({ ...query, status: 'presente' })
  ]);
  
  return total > 0 ? ((presencas / total) * 100).toFixed(2) : 100;
};

// Obter status de frequência baseado no percentual
frequenciaSchema.statics.getStatusFrequencia = function(percentual) {
  if (percentual >= 85) return { status: 'bom', cor: 'success', label: 'Boa Frequência' };
  if (percentual >= 75) return { status: 'atencao', cor: 'warning', label: 'Atenção' };
  return { status: 'critico', cor: 'error', label: 'Frequência Crítica' };
};

// Obter faltas por período
frequenciaSchema.statics.getFaltasPorPeriodo = async function(alunoId, ano, trimestre) {
  return await this.countDocuments({
    aluno: alunoId,
    ano,
    trimestre,
    status: { $in: ['falta', 'falta-justificada'] },
    ativo: true
  });
};

// Relatório de frequência da turma por dia
frequenciaSchema.statics.relatorioTurmaDia = async function(turmaId, data) {
  return await this.aggregate([
    {
      $match: {
        turma: mongoose.Types.ObjectId(turmaId),
        data: new Date(data),
        ativo: true
      }
    },
    {
      $group: {
        _id: '$status',
        total: { $sum: 1 }
      }
    }
  ]);
};

// Virtual para status de justificativa
frequenciaSchema.virtual('estaJustificado').get(function() {
  return this.status === 'falta-justificada' && this.justificativa?.descricao;
});

// Método de instância para justificar falta
frequenciaSchema.methods.justificarFalta = function(descricao, anexo = null) {
  this.status = 'falta-justificada';
  this.justificativa = {
    descricao,
    anexo,
    dataJustificativa: new Date()
  };
  return this.save();
};

const Frequencia = mongoose.model('Frequencia', frequenciaSchema);

module.exports = Frequencia;
