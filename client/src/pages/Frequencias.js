import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Alert,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Save,
  Refresh,
  Assessment,
  EventNote,
  Warning,
} from '@mui/icons-material';
import { frequenciaService, turmaService, disciplinaService, alunoService } from '../services';
import { toast } from 'react-toastify';

const STATUS_COLORS = {
  presente: { color: 'success', icon: CheckCircle, label: 'Presente' },
  falta: { color: 'error', icon: Cancel, label: 'Falta' },
  'falta-justificada': { color: 'warning', icon: EventNote, label: 'Justificada' },
};

const FREQUENCIA_STATUS = {
  bom: { color: 'success', label: 'Boa Frequência', min: 85 },
  atencao: { color: 'warning', label: 'Atenção', min: 75 },
  critico: { color: 'error', label: 'Crítico', min: 0 },
};

const Frequencias = () => {
  const [turmas, setTurmas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [frequencias, setFrequencias] = useState({});
  
  // Filtros
  const [filtros, setFiltros] = useState({
    turma: '',
    disciplina: '',
    data: new Date().toISOString().split('T')[0],
  });

  // Estado de presença dos alunos
  const [presencas, setPresencas] = useState({});
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Dialog de justificativa
  const [dialogJustificativa, setDialogJustificativa] = useState(false);
  const [alunoJustificar, setAlunoJustificar] = useState(null);
  const [justificativa, setJustificativa] = useState('');

  // Estatísticas
  const [stats, setStats] = useState({
    total: 0,
    presentes: 0,
    faltas: 0,
    percentual: 100,
  });

  useEffect(() => {
    loadTurmas();
    loadDisciplinas();
  }, []);

  useEffect(() => {
    if (filtros.turma && filtros.disciplina && filtros.data) {
      loadAlunos();
      loadFrequencia();
    }
  }, [filtros.turma, filtros.disciplina, filtros.data]);

  useEffect(() => {
    calcularStats();
  }, [presencas, alunos]);

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

  const loadAlunos = async () => {
    try {
      setLoading(true);
      const data = await alunoService.getAll({ turma: filtros.turma });
      setAlunos(data);
    } catch (error) {
      toast.error('Erro ao carregar alunos');
    } finally {
      setLoading(false);
    }
  };

  const loadFrequencia = async () => {
    try {
      setLoading(true);
      const response = await frequenciaService.getFrequenciaTurmaDia(
        filtros.turma,
        filtros.data,
        { disciplina: filtros.disciplina }
      );
      
      // Converter para objeto { alunoId: status }
      const presencasCarregadas = {};
      response.frequencias.forEach(freq => {
        presencasCarregadas[freq.aluno._id] = freq.status;
      });
      
      setPresencas(presencasCarregadas);
      setFrequencias(response.frequencias.reduce((acc, f) => {
        acc[f.aluno._id] = f;
        return acc;
      }, {}));
    } catch (error) {
      console.error('Erro ao carregar frequência:', error);
      // Se não houver frequência registrada, inicializar todos como presente
      const presencasInicial = {};
      alunos.forEach(aluno => {
        presencasInicial[aluno._id] = 'presente';
      });
      setPresencas(presencasInicial);
    } finally {
      setLoading(false);
    }
  };

  const calcularStats = () => {
    const total = alunos.length;
    const presentes = Object.values(presencas).filter(p => p === 'presente').length;
    const faltas = Object.values(presencas).filter(p => p === 'falta' || p === 'falta-justificada').length;
    const percentual = total > 0 ? ((presentes / total) * 100).toFixed(1) : 100;

    setStats({ total, presentes, faltas, percentual });
  };

  const handlePresencaChange = (alunoId, status) => {
    setPresencas(prev => ({
      ...prev,
      [alunoId]: status
    }));
  };

  const handleSalvarChamada = async () => {
    try {
      setSalvando(true);
      
      const turma = turmas.find(t => t._id === filtros.turma);
      
      await frequenciaService.registrarChamadaTurma(filtros.turma, {
        data: filtros.data,
        disciplina: filtros.disciplina,
        professor: turma?.disciplinas?.find(d => d.disciplina === filtros.disciplina)?.professor,
        periodo: turma?.turno || 'matutino',
        presencas
      });
      
      toast.success('Frequência salva com sucesso!');
      loadFrequencia();
    } catch (error) {
      toast.error('Erro ao salvar frequência: ' + (error.response?.data?.message || error.message));
    } finally {
      setSalvando(false);
    }
  };

  const handleJustificarFalta = async () => {
    try {
      if (!justificativa.trim()) {
        toast.error('Digite a justificativa');
        return;      }
      
      const freq = frequencias[alunoJustificar];
      if (freq) {
        await frequenciaService.justificarFalta(freq._id, {
          descricao: justificativa
        });
      }
      
      setPresencas(prev => ({
        ...prev,
        [alunoJustificar]: 'falta-justificada'
      }));
      
      toast.success('Falta justificada!');
      setDialogJustificativa(false);
      setJustificativa('');
      setAlunoJustificar(null);
      loadFrequencia();
    } catch (error) {
      toast.error('Erro ao justificar falta');
    }
  };

  const getFrequenciaStatus = (percentual) => {
    if (percentual >= FREQUENCIA_STATUS.bom.min) return FREQUENCIA_STATUS.bom;
    if (percentual >= FREQUENCIA_STATUS.atencao.min) return FREQUENCIA_STATUS.atencao;
    return FREQUENCIA_STATUS.critico;
  };

  const statusGeral = getFrequenciaStatus(parseFloat(stats.percentual));

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Controle de Frequência
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Registre a presença dos alunos diariamente
        </Typography>
      </Box>

      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Turma"
              value={filtros.turma}
              onChange={(e) => setFiltros({ ...filtros, turma: e.target.value })}
            >
              <MenuItem value="">Selecione uma turma</MenuItem>
              {turmas.map(turma => (
                <MenuItem key={turma._id} value={turma._id}>
                  {turma.nome} - {turma.turno}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Disciplina"
              value={filtros.disciplina}
              onChange={(e) => setFiltros({ ...filtros, disciplina: e.target.value })}
              disabled={!filtros.turma}
            >
              <MenuItem value="">Selecione uma disciplina</MenuItem>
              {disciplinas.map(disciplina => (
                <MenuItem key={disciplina._id} value={disciplina._id}>
                  {disciplina.nome}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="date"
              label="Data"
              value={filtros.data}
              onChange={(e) => setFiltros({ ...filtros, data: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Estatísticas */}
      {filtros.turma && filtros.disciplina && alunos.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" align="center">{stats.total}</Typography>
                <Typography variant="body2" align="center">Total de Alunos</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" align="center">{stats.presentes}</Typography>
                <Typography variant="body2" align="center">Presentes</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'error.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" align="center">{stats.faltas}</Typography>
                <Typography variant="body2" align="center">Faltas</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: statusGeral.color + '.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" align="center">{stats.percentual}%</Typography>
                <Typography variant="body2" align="center">{statusGeral.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabela de Alunos */}
      {filtros.turma && filtros.disciplina && alunos.length > 0 && (
        <>
          {loading && <LinearProgress sx={{ mb: 2 }} />}
          
          <Paper>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Lista de Presença - {new Date(filtros.data).toLocaleDateString('pt-BR')}
              </Typography>
              <Box>
                <Button
                  startIcon={<Refresh />}
                  onClick={loadFrequencia}
                  sx={{ mr: 1 }}
                >
                  Atualizar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSalvarChamada}
                  disabled={salvando}
                >
                  {salvando ? 'Salvando...' : 'Salvar Chamada'}
                </Button>
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Matrícula</TableCell>
                    <TableCell>Nome do Aluno</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alunos.map(aluno => {
                    const status = presencas[aluno._id] || 'presente';
                    const statusConfig = STATUS_COLORS[status];
                    const IconeStatus = statusConfig.icon;

                    return (
                      <TableRow key={aluno._id}>
                        <TableCell>
                          <Chip label={aluno.matricula} size="small" />
                        </TableCell>
                        <TableCell>{aluno.nome}</TableCell>
                        <TableCell align="center">
                          <ToggleButtonGroup
                            value={status}
                            exclusive
                            onChange={(e, newStatus) => {
                              if (newStatus) handlePresencaChange(aluno._id, newStatus);
                            }}
                            size="small"
                          >
                            <ToggleButton value="presente" color="success">
                              <Tooltip title="Presente">
                                <CheckCircle />
                              </Tooltip>
                            </ToggleButton>
                            <ToggleButton value="falta" color="error">
                              <Tooltip title="Falta">
                                <Cancel />
                              </Tooltip>
                            </ToggleButton>
                            <ToggleButton value="falta-justificada" color="warning">
                              <Tooltip title="Justificada">
                                <EventNote />
                              </Tooltip>
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={<IconeStatus />}
                            label={statusConfig.label}
                            color={statusConfig.color}
                            size="small"
                          />
                          {(status === 'falta' || status === 'falta-justificada') && (
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => {
                                setAlunoJustificar(aluno._id);
                                setDialogJustificativa(true);
                              }}
                            >
                              <EventNote />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}

      {!filtros.turma && (
        <Alert severity="info">
          Selecione uma turma, disciplina e data para iniciar o registro de frequência
        </Alert>
      )}

      {/* Dialog de Justificativa */}
      <Dialog 
        open={dialogJustificativa} 
        onClose={() => setDialogJustificativa(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Justificar Falta</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Justificativa"
            value={justificativa}
            onChange={(e) => setJustificativa(e.target.value)}
            sx={{ mt: 2 }}
            placeholder="Digite o motivo da falta..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogJustificativa(false)}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleJustificarFalta}
          >
            Salvar Justificativa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Frequencias;
