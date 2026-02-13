import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * Hook customizado para acessar o contexto de tema
 * @returns {Object} { isDarkMode, toggleTheme }
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  
  return context;
};
