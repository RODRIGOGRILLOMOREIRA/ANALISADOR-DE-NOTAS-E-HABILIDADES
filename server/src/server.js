const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/professores', require('./routes/professores'));
app.use('/api/disciplinas', require('./routes/disciplinas'));
app.use('/api/turmas', require('./routes/turmas'));
app.use('/api/alunos', require('./routes/alunos'));
app.use('/api/avaliacoes', require('./routes/avaliacoes'));
app.use('/api/habilidades', require('./routes/habilidades'));
app.use('/api/frequencias', require('./routes/frequencias'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/relatorios', require('./routes/relatorios'));

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API do Sistema Escolar está funcionando!' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
