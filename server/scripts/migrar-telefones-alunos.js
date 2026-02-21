const mongoose = require('mongoose');
require('dotenv').config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/escola')
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  });

const alunoSchema = new mongoose.Schema({}, { strict: false });
const Aluno = mongoose.model('Aluno', alunoSchema);

async function migrarTelefones() {
  try {
    console.log('Iniciando migração de telefones...');
    
    // Buscar todos os alunos que têm responsavel.telefone (campo antigo)
    const alunosComTelefoneAntigo = await Aluno.find({
      'responsavel.telefone': { $exists: true }
    });

    console.log(`Encontrados ${alunosComTelefoneAntigo.length} alunos com o campo telefone antigo`);

    let migrados = 0;
    for (const aluno of alunosComTelefoneAntigo) {
      // Se já tem telefones array, pular
      if (aluno.responsavel.telefones && Array.isArray(aluno.responsavel.telefones)) {
        continue;
      }

      // Migrar telefone único para array de telefones
      const telefoneAntigo = aluno.responsavel.telefone;
      
      if (telefoneAntigo && telefoneAntigo.trim()) {
        aluno.responsavel.telefones = [telefoneAntigo.trim()];
      } else {
        aluno.responsavel.telefones = [];
      }

      // Remover o campo antigo
      delete aluno.responsavel.telefone;

      await aluno.save();
      migrados++;
      console.log(`Migrado aluno: ${aluno.nome} - ${aluno.matricula}`);
    }

    console.log(`\nMigração concluída!`);
    console.log(`Total de alunos migrados: ${migrados}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Erro durante a migração:', error);
    process.exit(1);
  }
}

// Executar migração
migrarTelefones();
