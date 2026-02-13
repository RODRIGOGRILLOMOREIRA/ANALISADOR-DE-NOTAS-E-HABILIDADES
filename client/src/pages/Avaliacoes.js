import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const Avaliacoes = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Avaliações
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Sistema de lançamento de avaliações em desenvolvimento.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Funcionalidades:
        </Typography>
        <ul>
          <li>Lançamento de notas por trimestre (1º, 2º e 3º)</li>
          <li>Múltiplas avaliações por trimestre com pesos</li>
          <li>Cálculo automático da nota trimestral</li>
          <li>Cálculo automático da média anual</li>
          <li>Diferentes tipos de avaliação (prova, trabalho, participação, etc.)</li>
        </ul>
      </Paper>
    </Container>
  );
};

export default Avaliacoes;
