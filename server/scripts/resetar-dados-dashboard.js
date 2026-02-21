require('dotenv').config();
const mongoose = require('mongoose');
const Avaliacao = require('../src/models/Avaliacao');
const Frequencia = require('../src/models/Frequencia');

async function resetarDados() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Limpar avaliações
    const avaliacoes = await Avaliacao.countDocuments();
    console.log(`📊 Total de avaliações no banco: ${avaliacoes}`);
    
    if (avaliacoes > 0) {
      await Avaliacao.deleteMany({});
      console.log('🗑️ Avaliações removidas');
    } else {
      console.log('ℹ️ Não há avaliações para limpar');
    }

    // Limpar frequências
    const frequencias = await Frequencia.countDocuments();
    console.log(`📊 Total de frequências no banco: ${frequencias}`);
    
    if (frequencias > 0) {
      await Frequencia.deleteMany({});
      console.log('🗑️ Frequências removidas');
    } else {
      console.log('ℹ️ Não há frequências para limpar');
    }

    console.log('\n✅ Dados resetados com sucesso!');
    console.log('📝 Você pode agora inserir novos dados através do sistema');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao resetar dados:', error);
    process.exit(1);
  }
}

resetarDados();
