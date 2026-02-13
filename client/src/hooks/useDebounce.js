import { useState, useEffect } from 'react';

/**
 * Hook customizado para debounce (atraso na execução)
 * Útil para campos de busca para evitar muitas requisições
 * @param {*} value - Valor a ser debounced
 * @param {number} delay - Delay em milissegundos (default: 500ms)
 * @returns {*} Valor debounced
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
