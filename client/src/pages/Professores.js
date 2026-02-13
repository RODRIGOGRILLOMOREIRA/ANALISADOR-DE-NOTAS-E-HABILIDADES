import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { professorService } from '../services';
import { toast } from 'react-toastify';

const Professores = () => {
  const [professores, setProfessores] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadProfessores();
  }, []);

  const loadProfessores = async () => {
    try {
      const data = await professorService.getAll();
      setProfessores(data);
    } catch (error) {
      toast.error('Erro ao carregar professores');
    }
  };

  const handleOpen = (professor = null) => {
    if (professor) {
      setFormData({
        nome: professor.nome,
        email: professor.email,
        telefone: professor.telefone || '',
      });
      setEditId(professor._id);
    } else {
      setFormData({ nome: '', email: '', telefone: '' });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ nome: '', email: '', telefone: '' });
    setEditId(null);
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await professorService.update(editId, formData);
        toast.success('Professor atualizado com sucesso!');
      } else {
        await professorService.create(formData);
        toast.success('Professor criado com sucesso!');
      }
      handleClose();
      loadProfessores();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao salvar professor');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este professor?')) {
      try {
        await professorService.delete(id);
        toast.success('Professor excluído com sucesso!');
        loadProfessores();
      } catch (error) {
        toast.error('Erro ao excluir professor');
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Professores
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Novo Professor
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {professores.map((professor) => (
              <TableRow key={professor._id}>
                <TableCell>{professor.nome}</TableCell>
                <TableCell>{professor.email}</TableCell>
                <TableCell>{professor.telefone}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(professor)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(professor._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editId ? 'Editar Professor' : 'Novo Professor'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Telefone"
            fullWidth
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Professores;
