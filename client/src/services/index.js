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
    return response.data;
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
    return response.data;
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
    return response.data;
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
    return response.data;
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
    return response.data;
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
};

export const habilidadeService = {
  getAll: async (params = {}) => {
    const response = await api.get('/habilidades', { params });
    return response.data;
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
};
