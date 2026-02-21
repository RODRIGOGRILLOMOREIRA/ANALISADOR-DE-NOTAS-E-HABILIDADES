/**
 * Configuração do MongoDB Atlas para SGE CENTENÁRIO
 * 
 * IMPORTANTE: Configure as variáveis de ambiente no arquivo .env
 * 
 * Exemplo:
 * MONGODB_ATLAS_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/sge-centenario
 */

require('dotenv').config();

const getMongoDBConfig = () => {
  // String de conexão do MongoDB Atlas
  const MONGODB_URI = process.env.MONGODB_ATLAS_URI || 
    process.env.MONGODB_URI || 
    'mongodb://localhost:27017/escola';

  const config = {
    uri: MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Usar IPv4
      maxPoolSize: 10, // Máximo de 10 conexões simultâneas
      minPoolSize: 2,  // Mínimo de 2 conexões ativas
      maxIdleTimeMS: 10000,
      retryWrites: true,
      w: 'majority'
    }
  };

  return config;
};

// Testar conexão
const testConnection = async (mongoose) => {
  try {
    console.log('🔌 Testando conexão com MongoDB Atlas...');
    const config = getMongoDBConfig();
    
    await mongoose.connect(config.uri, config.options);
    
    console.log('✅ Conexão com MongoDB Atlas estabelecida com sucesso!');
    console.log(`📍 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB Atlas:', error.message);
    console.error('⚠️  Verifique:');
    console.error('   1. String de conexão no .env está correta');
    console.error('   2. IP do computador está na whitelist do MongoDB Atlas');
    console.error('   3. Usuário e senha estão corretos');
    console.error('   4. Conexão com internet está ativa');
    return false;
  }
};

module.exports = {
  getMongoDBConfig,
  testConnection
};
