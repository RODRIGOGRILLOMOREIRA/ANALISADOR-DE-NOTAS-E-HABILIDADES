import { useState, useCallback } from 'react';

/**
 * Hook customizado para gerenciar paginação
 * @param {number} initialPage - Página inicial (default: 1)
 * @param {number} initialLimit - Limite de itens por página (default: 10)
 * @returns {Object} { page, limit, setPage, setLimit, resetPagination, paginationParams }
 */
export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage + 1); // MUI usa índice 0, backend usa 1
  }, []);

  const handleLimitChange = useCallback((event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1); // Resetar para primeira página ao mudar limite
  }, []);

  const resetPagination = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
  }, [initialPage, initialLimit]);

  const paginationParams = {
    page,
    limit
  };

  return {
    page,
    limit,
    setPage,
    setLimit,
    handlePageChange,
    handleLimitChange,
    resetPagination,
    paginationParams
  };
};
