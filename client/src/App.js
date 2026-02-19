import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Páginas
import Login from './pages/Login';
import Home from './pages/Home';
import Professores from './pages/Professores';
import Disciplinas from './pages/Disciplinas';
import Turmas from './pages/Turmas';
import Alunos from './pages/Alunos';
import Avaliacoes from './pages/Avaliacoes';
import Habilidades from './pages/Habilidades';
import Dashboard from './pages/Dashboard';
import Relatorios from './pages/Relatorios';
import Frequencias from './pages/Frequencias';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route path="/" element={<Home />} />
              <Route path="/professores" element={<Professores />} />
              <Route path="/disciplinas" element={<Disciplinas />} />
              <Route path="/turmas" element={<Turmas />} />
              <Route path="/alunos" element={<Alunos />} />
              <Route path="/avaliacoes" element={<Avaliacoes />} />
              <Route path="/habilidades" element={<Habilidades />} />
              <Route path="/frequencias" element={<Frequencias />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/relatorios" element={<Relatorios />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
