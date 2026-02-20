const mongoose = require('mongoose');

const schoolSettingsSchema = new mongoose.Schema({
  nomeEscola: {
    type: String,
    required: true,
    default: 'Sistema de Gestão Escolar'
  },
  logo: {
    type: String, // URL ou base64 da logo
    default: null
  },
  endereco: {
    rua: String,
    numero: String,
    complemento: String,
    bairro: String,
    cidade: String,
    estado: String,
    cep: String
  },
  contato: {
    telefone: String,
    celular: String,
    email: String,
    site: String
  },
  redesSociais: {
    facebook: String,
    instagram: String,
    twitter: String
  },
  informacoesAdicionais: {
    cnpj: String,
    inep: String,
    diretor: String,
    coordenador: String,
    horarioFuncionamento: String
  },
  configuracoes: {
    anoLetivoAtual: {
      type: Number,
      default: new Date().getFullYear()
    },
    trimestreAtual: {
      type: Number,
      default: 1
    },
    notaMinimaAprovacao: {
      type: Number,
      default: 6.0
    },
    frequenciaMinimaAprovacao: {
      type: Number,
      default: 75
    }
  },
  tema: {
    corPrimaria: {
      type: String,
      default: '#00bcd4'
    },
    corSecundaria: {
      type: String,
      default: '#000000'
    }
  }
}, {
  timestamps: true
});

// Garantir que só existe um documento de configurações
schoolSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

schoolSettingsSchema.statics.updateSettings = async function(data) {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create(data);
  } else {
    Object.assign(settings, data);
    await settings.save();
  }
  return settings;
};

module.exports = mongoose.model('SchoolSettings', schoolSettingsSchema);
