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
  // Disciplinas que o professor leciona
  disciplinas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disciplina'
  }],
  // Vínculo direto com turmas e disciplinas (para facilitar consultas)
  turmasDisciplinas: [{
    turma: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Turma',
      required: true
    },
    disciplina: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Disciplina',
      required: true
    },
    ano: {
      type: Number,
      required: true,
      default: () => new Date().getFullYear()
    },
    ativo: {
      type: Boolean,
      default: true
    }
  }],
  // Dados adicionais
  cpf: {
    type: String,
    sparse: true,
    unique: true
  },
  dataNascimento: Date,
  endereco: {
    rua: String,
    numero: String,
    complemento: String,
    bairro: String,
    cidade: String,
    estado: String,
    cep: String
  },
  // Formação acadêmica
  formacao: [{
    nivel: {
      type: String,
      enum: ['graduacao', 'especializacao', 'mestrado', 'doutorado']
    },
    curso: String,
    instituicao: String,
    anoConclusao: Number
  }],
  // Vínculo com usuário do sistema
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
professorSchema.index({ 'turmasDisciplinas.turma': 1, 'turmasDisciplinas.disciplina': 1 });

// Virtual para obter turmas ativas
professorSchema.virtual('turmasAtivas').get(function() {
  return this.turmasDisciplinas.filter(td => td.ativo);
});

// Método para adicionar vínculo turma-disciplina
professorSchema.methods.adicionarTurmaDisciplina = function(turmaId, disciplinaId, ano) {
  const existe = this.turmasDisciplinas.some(
    td => td.turma.toString() === turmaId.toString() && 
          td.disciplina.toString() === disciplinaId.toString() &&
          td.ano === ano
  );
  
  if (!existe) {
    this.turmasDisciplinas.push({
      turma: turmaId,
      disciplina: disciplinaId,
      ano: ano || new Date().getFullYear(),
      ativo: true
    });
  }
  
  return this.save();
};

// Método para remover vínculo turma-disciplina
professorSchema.methods.removerTurmaDisciplina = function(turmaId, disciplinaId) {
  const index = this.turmasDisciplinas.findIndex(
    td => td.turma.toString() === turmaId.toString() && 
          td.disciplina.toString() === disciplinaId.toString()
  );
  
  if (index > -1) {
    this.turmasDisciplinas[index].ativo = false;
  }
  
  return this.save();
};

// Configurar virtuals no JSON
professorSchema.set('toJSON', { virtuals: true });
professorSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Professor', professorSchema);
