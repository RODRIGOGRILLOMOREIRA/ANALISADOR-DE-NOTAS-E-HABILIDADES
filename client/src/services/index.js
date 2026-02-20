import api from './api';

export const authService = {
  login: async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const professorService = {
  getAll: async () => {
    const response = await api.get('/professores');
    return response.data.data || response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/professores/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/professores', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/professores/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/professores/${id}`);
    return response.data;
  },
};

export const disciplinaService = {
  getAll: async () => {
    const response = await api.get('/disciplinas');
    return response.data.data || response.data;
  },

  create: async (data) => {
    const response = await api.post('/disciplinas', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/disciplinas/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/disciplinas/${id}`);
    return response.data;
  },
};

export const turmaService = {
  getAll: async () => {
    const response = await api.get('/turmas');
    return response.data.data || response.data;
  },

  create: async (data) => {
    const response = await api.post('/turmas', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/turmas/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/turmas/${id}`);
    return response.data;
  },
};

export const alunoService = {
  getAll: async (params = {}) => {
    const response = await api.get('/alunos', { params });
    return response.data.data || response.data;
  },

  create: async (data) => {
    const response = await api.post('/alunos', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/alunos/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/alunos/${id}`);
    return response.data;
  },
};

export const avaliacaoService = {
  getAll: async (params = {}) => {
    const response = await api.get('/avaliacoes', { params });
    return response.data.data || response.data;
  },

  create: async (data) => {
    const response = await api.post('/avaliacoes', data);
    return response.data;
  },

  adicionarNota: async (id, data) => {
    const response = await api.post(`/avaliacoes/${id}/notas`, data);
    return response.data;
  },

  getMediaAnual: async (alunoId, params = {}) => {
    const response = await api.get(`/avaliacoes/aluno/${alunoId}/media-anual`, { params });
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/avaliacoes/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/avaliacoes/${id}`);
    return response.data;
  },

  importar: async (avaliacoes) => {
    const response = await api.post('/avaliacoes/importar', { avaliacoes });
    return response.data;
  },

  getTemplatePorTurma: async (turmaId, params = {}) => {
    const response = await api.get(`/avaliacoes/template/${turmaId}`, { params });
    return response.data;
  },
};

export const habilidadeService = {
  getAll: async (params = {}) => {
    const response = await api.get('/habilidades', { params });
    return response.data.data || response.data;
  },

  create: async (data) => {
    const response = await api.post('/habilidades', data);
    return response.data;
  },

  updateDesempenho: async (id, data) => {
    const response = await api.put(`/habilidades/${id}/desempenho`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/habilidades/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/habilidades/${id}`);
    return response.data;
  },

  getPorAluno: async (alunoId, params = {}) => {
    const response = await api.get(`/habilidades/aluno/${alunoId}`, { params });
    return response.data;
  },

  getRelatorioPorTurma: async (turmaId, params = {}) => {
    const response = await api.get(`/habilidades/relatorio/turma/${turmaId}`, { params });
    return response.data;
  },
};

export const dashboardService = {
  getEstatisticas: async (params = {}) => {
    const response = await api.get('/dashboard/estatisticas', { params });
    return response.data;
  },

  getDesempenhoDisciplina: async (params = {}) => {
    const response = await api.get('/dashboard/desempenho-disciplina', { params });
    return response.data;
  },

  getEvolucaoTrimestral: async (params = {}) => {
    const response = await api.get('/dashboard/evolucao-trimestral', { params });
    return response.data;
  },

  getAlunosRisco: async (params = {}) => {
    const response = await api.get('/dashboard/alunos-risco', { params });
    return response.data;
  },

  getHabilidadesDesenvolvidas: async (params = {}) => {
    const response = await api.get('/dashboard/habilidades-desenvolvidas', { params });
    return response.data;
  },

  getEvolucaoHabilidades: async (params = {}) => {
    const response = await api.get('/dashboard/evolucao-habilidades', { params });
    return response.data;
  },

  getDistribuicaoNiveisHabilidades: async (params = {}) => {
    const response = await api.get('/dashboard/distribuicao-niveis-habilidades', { params });
    return response.data;
  },
};

export const relatorioService = {
  // Gera boletim do aluno em PDF e faz download
  gerarBoletimAluno: async (alunoId, ano = null) => {
    const params = ano ? { ano } : {};
    const response = await api.get(`/relatorios/boletim/${alunoId}`, { 
      params,
      responseType: 'blob' 
    });
    
    // Criar blob e fazer download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `boletim_aluno_${alunoId}_${ano || new Date().getFullYear()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Gera relatório de desempenho da turma em PDF
  gerarRelatorioTurma: async (turmaId, params = {}) => {
    const response = await api.get(`/relatorios/desempenho-turma/${turmaId}`, { 
      params,
      responseType: 'blob' 
    });
    
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_turma_${turmaId}_${new Date().getTime()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Retorna matriz de habilidades (JSON)
  getMatrizHabilidades: async (alunoId, params = {}) => {
    const response = await api.get(`/relatorios/matriz-habilidades/${alunoId}`, { params });
    return response.data;
  },

  // Retorna mapa de calor (JSON)
  getMapaCalor: async (turmaId, params = {}) => {
    const response = await api.get(`/relatorios/mapa-calor/${turmaId}`, { params });
    return response.data;
  },

  // Retorna habilidades não trabalhadas (JSON)
  getHabilidadesNaoTrabalhadas: async (turmaId, params = {}) => {
    const response = await api.get(`/relatorios/habilidades-nao-trabalhadas/${turmaId}`, { params });
    return response.data;
  },
};

export const frequenciaService = {
  getAll: async (params = {}) => {
    const response = await api.get('/frequencias', { params });
    return response.data.data || response.data;
  },

  registrar: async (data) => {
    const response = await api.post('/frequencias', data);
    return response.data;
  },

  registrarChamadaTurma: async (turmaId, data) => {
    const response = await api.post(`/frequencias/turma/${turmaId}/chamada`, data);
    return response.data;
  },

  getFrequenciaAluno: async (alunoId, params = {}) => {
    const response = await api.get(`/frequencias/aluno/${alunoId}`, { params });
    return response.data;
  },

  getFrequenciaTurmaDia: async (turmaId, data, params = {}) => {
    const response = await api.get(`/frequencias/turma/${turmaId}/dia/${data}`, { params });
    return response.data;
  },

  getDashboard: async (params = {}) => {
    const response = await api.get('/frequencias/dashboard', { params });
    return response.data;
  },

  justificarFalta: async (id, data) => {
    const response = await api.put(`/frequencias/${id}/justificar`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/frequencias/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/frequencias/${id}`);
    return response.data;
  },

  importar: async (frequencias) => {
    const response = await api.post('/frequencias/importar', { frequencias });
    return response.data;
  },
};
