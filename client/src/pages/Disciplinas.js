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
  Fade,
  Zoom,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { disciplinaService } from '../services';
import { toast } from 'react-toastify';
import PageHeader from '../components/PageHeader';
import { Class as DisciplinasIcon } from '@mui/icons-material';

const Disciplinas = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    cargaHoraria: '',
    descricao: '',
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadDisciplinas();
  }, []);

  const loadDisciplinas = async () => {
    try {
      const data = await disciplinaService.getAll();
      setDisciplinas(data);
    } catch (error) {
      toast.error('Erro ao carregar disciplinas');
    }
  };

  const handleOpen = (disciplina = null) => {
    if (disciplina) {
      setFormData({
        nome: disciplina.nome,
        codigo: disciplina.codigo || '',
        cargaHoraria: disciplina.cargaHoraria || '',
        descricao: disciplina.descricao || '',
      });
      setEditId(disciplina._id);
    } else {
      setFormData({ nome: '', codigo: '', cargaHoraria: '', descricao: '' });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ nome: '', codigo: '', cargaHoraria: '', descricao: '' });
    setEditId(null);
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await disciplinaService.update(editId, formData);
        toast.success('Disciplina atualizada com sucesso!');
      } else {
        await disciplinaService.create(formData);
        toast.success('Disciplina criada com sucesso!');
      }
      handleClose();
      loadDisciplinas();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao salvar disciplina');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta disciplina?')) {
      try {
        await disciplinaService.delete(id);
        toast.success('Disciplina excluída com sucesso!');
        loadDisciplinas();
      } catch (error) {
        toast.error('Erro ao excluir disciplina');
      }
    }
  };

  return (
    <Container maxWidth="xl">
      <PageHeader 
        title="Disciplinas"
        subtitle="Gerencie as disciplinas do currículo escolar"
        icon={DisciplinasIcon}
      />
      
      <Zoom in={true} timeout={400}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            mb: 3,
            alignItems: 'center' 
          }}
        >
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1.5,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
              }
            }}
          >
            Nova Disciplina
          </Button>
        </Box>
      </Zoom>

      <Fade in={true} timeout={600}>
        <TableContainer 
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            }
          }}
        >
        <Table>
          <TableHead>
            <TableRow 
              sx={{
                bgcolor: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(0, 188, 212, 0.15)' 
                  : 'rgba(102, 126, 234, 0.1)',
              }}
            >
              <TableCell sx={{ fontWeight: 700 }}>Código</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Carga Horária</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {disciplinas.map((disciplina) => (
              <TableRow 
                key={disciplina._id}
                sx={{
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.mode === 'dark' 
                      ? 'rgba(0, 188, 212, 0.08)' 
                      : 'rgba(102, 126, 234, 0.05)',
                    transform: 'scale(1.01)',
                  }
                }}
              >
                <TableCell>{disciplina.codigo}</TableCell>
                <TableCell>{disciplina.nome}</TableCell>
                <TableCell>{disciplina.cargaHoraria}h</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(disciplina)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(disciplina._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Fade>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editId ? 'Editar Disciplina' : 'Nova Disciplina'}
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
            label="Código"
            fullWidth
            value={formData.codigo}
            onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Carga Horária"
            type="number"
            fullWidth
            value={formData.cargaHoraria}
            onChange={(e) => setFormData({ ...formData, cargaHoraria: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Descrição"
            fullWidth
            multiline
            rows={3}
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
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

export default Disciplinas;
