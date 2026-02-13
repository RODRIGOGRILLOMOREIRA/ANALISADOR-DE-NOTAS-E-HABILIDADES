import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const Alunos = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Alunos
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Sistema de gerenciamento de alunos em desenvolvimento.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Funcionalidades: Cadastro de alunos, informações de responsáveis,
          associação com turmas.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Alunos;
