import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Hook customizado para fazer requisições HTTP com loading e error states
 * @param {string} endpoint - Endpoint da API
 * @param {Object} options - Opções da requisição
 * @returns {Object} { data, loading, error, refetch }
 */
export const useFetch = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!endpoint) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const method = options.method || 'GET';
      let response;

      if (method === 'GET') {
        response = await api.get(endpoint, { params: options.params });
      } else if (method === 'POST') {
        response = await api.post(endpoint, options.body);
      } else if (method === 'PUT') {
        response = await api.put(endpoint, options.body);
      } else if (method === 'DELETE') {
        response = await api.delete(endpoint);
      }

      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao buscar dados');
      console.error('Erro no useFetch:', err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, options.method, options.params, options.body]);

  useEffect(() => {
    if (options.skip) {
      setLoading(false);
      return;
    }
    fetchData();
  }, [fetchData, options.skip]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};
