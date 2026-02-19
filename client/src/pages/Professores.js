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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { professorService, turmaService, disciplinaService } from '../services';
import { toast } from 'react-toastify';

const Professores = () => {
  const [professores, setProfessores] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    turmasDisciplinas: [],
  });
  const [editId, setEditId] = useState(null);
  
  // Para adicionar nova vinculação
  const [novaVinculacao, setNovaVinculacao] = useState({
    turma: '',
    disciplina: '',
    ano: new Date().getFullYear(),
  });

  useEffect(() => {
    loadProfessores();
    loadTurmas();
    loadDisciplinas();
  }, []);

  const loadProfessores = async () => {
    try {
      const data = await professorService.getAll();
      setProfessores(data);
    } catch (error) {
      toast.error('Erro ao carregar professores');
    }
  };

  const loadTurmas = async () => {
    try {
      const data = await turmaService.getAll();
      setTurmas(data);
    } catch (error) {
      toast.error('Erro ao carregar turmas');
    }
  };

  const loadDisciplinas = async () => {
    try {
      const data = await disciplinaService.getAll();
      setDisciplinas(data);
    } catch (error) {
      toast.error('Erro ao carregar disciplinas');
    }
  };

  const handleOpen = (professor = null) => {
    if (professor) {
      setFormData({
        nome: professor.nome,
        email: professor.email,
        telefone: professor.telefone || '',
        turmasDisciplinas: professor.turmasDisciplinas || [],
      });
      setEditId(professor._id);
    } else {
      setFormData({ nome: '', email: '', telefone: '', turmasDisciplinas: [] });
      setEditId(null);
    }
    setNovaVinculacao({ turma: '', disciplina: '', ano: new Date().getFullYear() });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ nome: '', email: '', telefone: '', turmasDisciplinas: [] });
    setNovaVinculacao({ turma: '', disciplina: '', ano: new Date().getFullYear() });
    setEditId(null);
  };

  const handleAdicionarVinculacao = () => {
    if (!novaVinculacao.turma || !novaVinculacao.disciplina) {
      toast.error('Selecione turma e disciplina');
      return;
    }

    // Verificar se já existe
    const jaExiste = formData.turmasDisciplinas.some(
      v => v.turma === novaVinculacao.turma && v.disciplina === novaVinculacao.disciplina
    );

    if (jaExiste) {
      toast.error('Vinculação já existe');
      return;
    }

    setFormData({
      ...formData,
      turmasDisciplinas: [...formData.turmasDisciplinas, { ...novaVinculacao, ativo: true }]
    });
    setNovaVinculacao({ turma: '', disciplina: '', ano: new Date().getFullYear() });
  };

  const handleRemoverVinculacao = (index) => {
    const novasVinculacoes = formData.turmasDisciplinas.filter((_, i) => i !== index);
    setFormData({ ...formData, turmasDisciplinas: novasVinculacoes });
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
              <TableCell>Turmas/Disciplinas</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {professores.map((professor) => (
              <TableRow key={professor._id}>
                <TableCell>{professor.nome}</TableCell>
                <TableCell>{professor.email}</TableCell>
                <TableCell>{professor.telefone}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {professor.turmasDisciplinas && professor.turmasDisciplinas.length > 0 ? (
                      professor.turmasDisciplinas.map((vinc, idx) => (
                        <Chip
                          key={idx}
                          size="small"
                          label={`${vinc.turma?.nome || 'N/A'} - ${vinc.disciplina?.nome || 'N/A'}`}
                          color={vinc.ativo ? 'primary' : 'default'}
                        />
                      ))
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Nenhuma vinculação
                      </Typography>
                    )}
                  </Box>
                </TableCell>
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

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editId ? 'Editar Professor' : 'Novo Professor'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                label="Nome"
                fullWidth
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Telefone"
                fullWidth
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
            </Grid>

            {/* Seção de Vinculação */}
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Vincular Turmas e Disciplinas
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Turma</InputLabel>
                        <Select
                          value={novaVinculacao.turma}
                          label="Turma"
                          onChange={(e) => setNovaVinculacao({ ...novaVinculacao, turma: e.target.value })}
                        >
                          <MenuItem value="">Selecione</MenuItem>
                          {turmas.map(turma => (
                            <MenuItem key={turma._id} value={turma._id}>
                              {turma.nome}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Disciplina</InputLabel>
                        <Select
                          value={novaVinculacao.disciplina}
                          label="Disciplina"
                          onChange={(e) => setNovaVinculacao({ ...novaVinculacao, disciplina: e.target.value })}
                        >
                          <MenuItem value="">Selecione</MenuItem>
                          {disciplinas.map(disciplina => (
                            <MenuItem key={disciplina._id} value={disciplina._id}>
                              {disciplina.nome}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Ano"
                        value={novaVinculacao.ano}
                        onChange={(e) => setNovaVinculacao({ ...novaVinculacao, ano: parseInt(e.target.value) })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={handleAdicionarVinculacao}
                        sx={{ height: '40px' }}
                      >
                        Adicionar
                      </Button>
                    </Grid>
                  </Grid>

                  {/* Lista de Vinculações */}
                  {formData.turmasDisciplinas.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Vinculações Atuais:
                      </Typography>
                      <List dense>
                        {formData.turmasDisciplinas.map((vinc, index) => {
                          const turma = turmas.find(t => t._id === vinc.turma);
                          const disciplina = disciplinas.find(d => d._id === vinc.disciplina);
                          
                          return (
                            <ListItem key={index}>
                              <ListItemText
                                primary={`${turma?.nome || 'N/A'} - ${disciplina?.nome || 'N/A'}`}
                                secondary={`Ano: ${vinc.ano} | Status: ${vinc.ativo ? 'Ativo' : 'Inativo'}`}
                              />
                              <ListItemSecondaryAction>
                                <IconButton
                                  edge="end"
                                  onClick={() => handleRemoverVinculacao(index)}
                                  color="error"
                                >
                                  <Delete />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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
