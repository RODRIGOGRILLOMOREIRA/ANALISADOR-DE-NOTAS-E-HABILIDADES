const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });

const connectDB = async () => {
  try {
    // Priorizar MongoDB Atlas, depois MONGODB_URI, depois localhost
    const uri = process.env.MONGODB_ATLAS_URI || 
                process.env.MONGODB_URI || 
                'mongodb://localhost:27017/escola';
    
    console.log('🔌 Conectando ao MongoDB...');
    
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error(`❌ Erro ao conectar ao MongoDB: ${error.message}`);
    console.error('⚠️  Verifique:');
    console.error('   1. String de conexão no arquivo .env');
    console.error('   2. Conexão com internet (se usando MongoDB Atlas)');
    console.error('   3. IP na whitelist do MongoDB Atlas');
    process.exit(1);
  }
};

module.exports = connectDB;
