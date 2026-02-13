import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const Habilidades = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Habilidades
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Sistema de cadastro e acompanhamento de habilidades em desenvolvimento.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Funcionalidades:
        </Typography>
        <ul>
          <li>Cadastro de habilidades por disciplina e trimestre</li>
          <li>Níveis de desenvolvimento: Não Desenvolvido, Em Desenvolvimento, Desenvolvido, Plenamente Desenvolvido</li>
          <li>Acompanhamento individual por aluno</li>
          <li>Observações específicas para cada aluno</li>
          <li>Relatórios de desenvolvimento por turma</li>
        </ul>
      </Paper>
    </Container>
  );
};

export default Habilidades;
