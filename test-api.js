// Script de teste rápido para verificar estrutura das respostas da API
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const testEndpoint = async (endpoint, token = null) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_URL}${endpoint}`, { headers });
    
    console.log(`\n✅ ${endpoint}`);
    console.log('Estrutura da resposta:', Object.keys(response.data));
    
    if (response.data.data) {
      console.log(`   - Tipo de data: ${Array.isArray(response.data.data) ? 'Array' : 'Object'}`);
      console.log(`   - Itens: ${Array.isArray(response.data.data) ? response.data.data.length : 'N/A'}`);
    } else if (Array.isArray(response.data)) {
      console.log(`   - Resposta direta (Array): ${response.data.length} itens`);
    }
    
    if (response.data.pagination) {
      console.log('   - Paginação:', response.data.pagination);
    }
    
    return true;
  } catch (error) {
    console.log(`\n❌ ${endpoint}`);
    console.log('   Erro:', error.response?.status, error.response?.data?.message || error.message);
    return false;
  }
};

const runTests = async () => {
  console.log('🔍 Testando estrutura das respostas da API...\n');
  console.log('=' .repeat(60));
  
  // Primeiro, fazer login para obter token
  try {
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@escola.com',
      senha: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso!');
    
    // Testar endpoints com autenticação
    await testEndpoint('/disciplinas', token);
    await testEndpoint('/professores', token);
    await testEndpoint('/turmas', token);
    await testEndpoint('/alunos', token);
    await testEndpoint('/avaliacoes', token);
    await testEndpoint('/habilidades', token);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Testes concluídos!\n');
    
  } catch (error) {
    console.log('❌ Erro no login:', error.response?.data?.message || error.message);
  }
};

runTests();
