import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
} from '@mui/material';
import {
  School,
  Class,
  People,
  Assessment,
  Assignment,
  BarChart,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const cards = [
    { title: 'Professores', icon: <School sx={{ fontSize: 40 }} />, path: '/professores', color: '#1976d2' },
    { title: 'Disciplinas', icon: <Class sx={{ fontSize: 40 }} />, path: '/disciplinas', color: '#2e7d32' },
    { title: 'Turmas', icon: <People sx={{ fontSize: 40 }} />, path: '/turmas', color: '#ed6c02' },
    { title: 'Alunos', icon: <People sx={{ fontSize: 40 }} />, path: '/alunos', color: '#9c27b0' },
    { title: 'Avaliações', icon: <Assessment sx={{ fontSize: 40 }} />, path: '/avaliacoes', color: '#d32f2f' },
    { title: 'Habilidades', icon: <Assignment sx={{ fontSize: 40 }} />, path: '/habilidades', color: '#0288d1' },
    { title: 'Dashboard', icon: <BarChart sx={{ fontSize: 40 }} />, path: '/dashboard', color: '#f57c00' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bem-vindo, {user?.nome}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sistema de Gerenciamento Escolar - Controle de Notas e Habilidades
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 6,
                },
              }}
              onClick={() => window.location.href = card.path}
            >
              <Box sx={{ color: card.color, mb: 2 }}>
                {card.icon}
              </Box>
              <Typography variant="h6" component="h2" align="center">
                {card.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Funcionalidades do Sistema
          </Typography>
          <ul>
            <li>Cadastro completo de professores, disciplinas, turmas e alunos</li>
            <li>Lançamento de avaliações com cálculo automático de notas trimestrais</li>
            <li>Cálculo automático da média anual (3 trimestres)</li>
            <li>Gestão de habilidades desenvolvidas por trimestre</li>
            <li>Dashboards analíticos com filtros personalizáveis</li>
            <li>Visualização de alunos em risco de reprovação</li>
            <li>Análise de evolução trimestral e desempenho por disciplina</li>
          </ul>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;
