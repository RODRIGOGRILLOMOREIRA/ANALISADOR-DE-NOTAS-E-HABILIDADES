import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const Turmas = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Turmas
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Sistema de gerenciamento de turmas em desenvolvimento.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Funcionalidades: Cadastro de turmas, associação com disciplinas e professores,
          matrícula de alunos.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Turmas;
