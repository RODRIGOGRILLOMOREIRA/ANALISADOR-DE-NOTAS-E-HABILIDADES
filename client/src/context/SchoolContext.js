import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SchoolContext = createContext();

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool deve ser usado dentro de SchoolProvider');
  }
  return context;
};

export const SchoolProvider = ({ children }) => {
  const [schoolSettings, setSchoolSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadSchoolSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/settings');
      console.log('SchoolSettings carregadas:', response.data);
      setSchoolSettings(response.data);
      setRefreshKey(prev => prev + 1); // Forçar re-renderização
    } catch (error) {
      console.error('Erro ao carregar configurações da escola:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchoolSettings();
  }, []);

  const updateSchoolSettings = (newSettings) => {
    console.log('Atualizando SchoolSettings:', newSettings);
    setSchoolSettings(newSettings);
    setRefreshKey(prev => prev + 1); // Forçar re-renderização
  };

  return (
    <SchoolContext.Provider value={{ 
      schoolSettings, 
      loading, 
      loadSchoolSettings,
      updateSchoolSettings,
      refreshKey
    }}>
      {children}
    </SchoolContext.Provider>
  );
};
