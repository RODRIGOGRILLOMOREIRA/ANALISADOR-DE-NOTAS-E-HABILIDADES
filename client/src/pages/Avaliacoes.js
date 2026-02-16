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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Tooltip,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ExpandMore,
  Assessment,
  Refresh,
  Save,
  Cancel,
} from '@mui/icons-material';
import { avaliacaoService, turmaService, disciplinaService, alunoService } from '../services';
import { toast } from 'react-toastify';

const TIPOS_AVALIACAO = [
  { value: 'prova', label: 'Prova', color: 'primary' },
  { value: 'trabalho', label: 'Trabalho', color: 'secondary' },
  { value: 'participacao', label: 'Participação', color: 'success' },
  { value: 'simulado', label: 'Simulado', color: 'warning' },
  { value: 'atividade', label: 'Atividade', color: 'info' },
  { value: 'seminario', label: 'Seminário', color: 'secondary' },
  { value: 'projeto', label: 'Projeto', color: 'primary' },
  { value: 'pesquisa', label: 'Pesquisa', color: 'info' },
  { value: 'outro', label: 'Outro', color: 'default' },
];

const Avaliacoes = () => {
  const [turmas, setTurmas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [todasAvaliacoes, setTodasAvaliacoes] = useState([]); // Todas as avaliações do ano para cálculo da média anual
  
  // Filtros
  const [filtros, setFiltros] = useState({
    turma: '',
    disciplina: '',
    trimestre: 1,
    ano: new Date().getFullYear(),
  });

  // Diálogo de avaliação
  const [openDialog, setOpenDialog] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [avaliacaoAtual, setAvaliacaoAtual] = useState(null);
  const [novasAvaliacoes, setNovasAvaliacoes] = useState([
    { tipo: 'prova', descricao: '', nota: '', peso: 1 }
  ]);

  // Auto-refresh
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTurmas();
    loadDisciplinas();
  }, []);

  useEffect(() => {
    if (filtros.turma && filtros.disciplina) {
      loadAlunos();
      loadAvaliacoes();
      loadTodasAvaliacoes(); // Carrega todas as avaliações do ano para média anual
    }
  }, [filtros]);

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    let interval;
    if (autoRefresh && filtros.turma && filtros.disciplina) {
      interval = setInterval(() => {
        loadAvaliacoes();
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, filtros]);

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
      const data = await alunoService.getAll({ turma: filtros.turma });
      setAlunos(data);
    } catch (error) {
      toast.error('Erro ao carregar alunos');
    }
  };

  const loadAvaliacoes = async () => {
    try {
      setLoading(true);
      const data = await avaliacaoService.getAll({
        turma: filtros.turma,
        disciplina: filtros.disciplina,
        ano: filtros.ano,
        trimestre: filtros.trimestre,
      });
      setAvaliacoes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
      setAvaliacoes([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTodasAvaliacoes = async () => {
    try {
      // Carrega avaliações de TODOS os trimestres para cálculo da média anual
      const data = await avaliacaoService.getAll({
        turma: filtros.turma,
        disciplina: filtros.disciplina,
        ano: filtros.ano,
        // Sem filtro de trimestre para pegar todos
      });
      setTodasAvaliacoes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar todas avaliações:', error);
      setTodasAvaliacoes([]);
    }
  };

  const handleOpenDialog = (aluno) => {
    setAlunoSelecionado(aluno);
    
    // Buscar avaliação existente para este aluno
    const avaliacaoExistente = avaliacoes.find(av => av.aluno._id === aluno._id);
    
    if (avaliacaoExistente) {
      setAvaliacaoAtual(avaliacaoExistente);
      setNovasAvaliacoes(avaliacaoExistente.avaliacoes.map(av => ({
        _id: av._id,
        tipo: av.tipo,
        descricao: av.descricao || '',
        nota: av.nota,
        peso: av.peso,
        data: av.data,
      })));
    } else {
      setAvaliacaoAtual(null);
      setNovasAvaliacoes([{ tipo: 'prova', descricao: '', nota: '', peso: 1 }]);
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAlunoSelecionado(null);
    setAvaliacaoAtual(null);
    setNovasAvaliacoes([{ tipo: 'prova', descricao: '', nota: '', peso: 1 }]);
  };

  const handleAddAvaliacao = () => {
    setNovasAvaliacoes([...novasAvaliacoes, { tipo: 'prova', descricao: '', nota: '', peso: 1 }]);
  };

  const handleRemoveAvaliacao = (index) => {
    const updated = novasAvaliacoes.filter((_, i) => i !== index);
    setNovasAvaliacoes(updated.length > 0 ? updated : [{ tipo: 'prova', descricao: '', nota: '', peso: 1 }]);
  };

  const handleAvaliacaoChange = (index, field, value) => {
    const updated = [...novasAvaliacoes];
    updated[index][field] = value;
    setNovasAvaliacoes(updated);
  };

  const calcularNotaTrimestral = (avaliacoes) => {
    if (!avaliacoes || avaliacoes.length === 0) return 0;
    
    // SOMA SIMPLES de todas as notas (sem divisão, sem pesos)
    let somaNotas = 0;
    
    avaliacoes.forEach(av => {
      const nota = parseFloat(av.nota) || 0;
      somaNotas += nota;
    });
    
    return somaNotas.toFixed(2);
  };

  const validarLimiteTrimestral = (avaliacoes) => {
    if (!avaliacoes || avaliacoes.length === 0) return true;
    
    let somaNotas = 0;
    avaliacoes.forEach(av => {
      const nota = parseFloat(av.nota) || 0;
      somaNotas += nota;
    });
    
    return somaNotas <= 10;
  };

  const handleSalvarAvaliacoes = async () => {
    try {
      // Validar avaliações
      const avaliacoesValidas = novasAvaliacoes.filter(av => 
        av.nota !== '' && !isNaN(av.nota) && av.nota >= 0 && av.nota <= 10
      );

      if (avaliacoesValidas.length === 0) {
        toast.error('Adicione pelo menos uma avaliação válida');
        return;
      }

      // Validar limite trimestral (soma não pode ultrapassar 10)
      if (!validarLimiteTrimestral(avaliacoesValidas)) {
        const somaAtual = avaliacoesValidas.reduce((acc, av) => acc + (parseFloat(av.nota) || 0), 0);
        toast.error(
          `⚠️ LIMITE EXCEDIDO! A soma das notas (${somaAtual.toFixed(2)}) ultrapassou o limite de 10.0 pontos. Por favor, ajuste as notas.`,
          { autoClose: 8000 }
        );
        return;
      }

      const user = JSON.parse(localStorage.getItem('user'));
      const payload = {
        aluno: alunoSelecionado._id,
        disciplina: filtros.disciplina,
        turma: filtros.turma,
        professor: user?._id || null,
        ano: filtros.ano,
        trimestre: filtros.trimestre,
        avaliacoes: avaliacoesValidas.map(av => ({
          tipo: av.tipo,
          descricao: av.descricao,
          nota: parseFloat(av.nota),
          peso: parseFloat(av.peso) || 1,
        })),
      };

      if (avaliacaoAtual) {
        await avaliacaoService.update(avaliacaoAtual._id, payload);
        toast.success('Avaliações atualizadas com sucesso!');
      } else {
        await avaliacaoService.create(payload);
        toast.success('Avaliações cadastradas com sucesso!');
      }

      // Aguardar recarregamento dos dados antes de fechar o diálogo
      await Promise.all([
        loadAvaliacoes(),
        loadTodasAvaliacoes()
      ]);
      
      handleCloseDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao salvar avaliações');
    }
  };

  const handleDeleteAvaliacao = async (id) => {
    if (window.confirm('Deseja realmente excluir todas as avaliações deste aluno neste trimestre?')) {
      try {
        await avaliacaoService.delete(id);
        toast.success('Avaliações excluídas com sucesso!');
        loadAvaliacoes();
        loadTodasAvaliacoes(); // Atualiza também as avaliações para média anual
      } catch (error) {
        toast.error('Erro ao excluir avaliações');
      }
    }
  };

  const getNotaColor = (nota) => {
    if (nota >= 7) return 'success';
    if (nota >= 5) return 'warning';
    return 'error';
  };

  const getTipoColor = (tipo) => {
    return TIPOS_AVALIACAO.find(t => t.value === tipo)?.color || 'default';
  };

  const getMediaAnualAluno = (alunoId) => {
    // Busca avaliações de TODOS os trimestres
    const avaliacoesAluno = todasAvaliacoes.filter(av => av.aluno._id === alunoId);
    if (avaliacoesAluno.length === 0) return '0.00';
    
    // Cria objeto com notas por trimestre
    const notasPorTrimestre = {};
    avaliacoesAluno.forEach(av => {
      notasPorTrimestre[av.trimestre] = av.notaTrimestre || 0;
    });
    
    // Fórmula: (T1×3 + T2×3 + T3×4) / 10
    const t1 = notasPorTrimestre[1] || 0;
    const t2 = notasPorTrimestre[2] || 0;
    const t3 = notasPorTrimestre[3] || 0;
    
    // Se não tem nenhuma nota lançada, retorna 0
    if (t1 === 0 && t2 === 0 && t3 === 0) return '0.00';
    
    const mediaAnual = (t1 * 3 + t2 * 3 + t3 * 4) / 10;
    return mediaAnual.toFixed(2);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          📊 Lançamento de Avaliações
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={autoRefresh ? 'Atualização automática ativa' : 'Atualização automática desativada'}>
            <Button
              variant={autoRefresh ? 'contained' : 'outlined'}
              color={autoRefresh ? 'success' : 'default'}
              onClick={() => setAutoRefresh(!autoRefresh)}
              startIcon={<Refresh />}
            >
              Auto {autoRefresh ? 'ON' : 'OFF'}
            </Button>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadAvaliacoes}
            disabled={!filtros.turma || !filtros.disciplina}
          >
            Atualizar
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtros
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Turma"
              value={filtros.turma}
              onChange={(e) => setFiltros({ ...filtros, turma: e.target.value })}
            >
              <MenuItem value="">Selecione...</MenuItem>
              {turmas.map((turma) => (
                <MenuItem key={turma._id} value={turma._id}>
                  {turma.nome} - {turma.serie}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Disciplina"
              value={filtros.disciplina}
              onChange={(e) => setFiltros({ ...filtros, disciplina: e.target.value })}
            >
              <MenuItem value="">Selecione...</MenuItem>
              {disciplinas.map((disciplina) => (
                <MenuItem key={disciplina._id} value={disciplina._id}>
                  {disciplina.nome}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Trimestre"
              value={filtros.trimestre}
              onChange={(e) => setFiltros({ ...filtros, trimestre: parseInt(e.target.value) })}
            >
              <MenuItem value={1}>1º Trimestre</MenuItem>
              <MenuItem value={2}>2º Trimestre</MenuItem>
              <MenuItem value={3}>3º Trimestre</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="number"
              fullWidth
              label="Ano"
              value={filtros.ano}
              onChange={(e) => setFiltros({ ...filtros, ano: parseInt(e.target.value) })}
            />
          </Grid>
        </Grid>

        {filtros.turma && filtros.disciplina && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Instruções:</strong> Clique no botão 📝 para lançar ou editar as avaliações de cada aluno.
            As notas são calculadas automaticamente com base nos pesos configurados.
          </Alert>
        )}
      </Paper>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Lista de Alunos */}
      {filtros.turma && filtros.disciplina && alunos.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Matrícula</TableCell>
                <TableCell>Nome do Aluno</TableCell>
                <TableCell align="center">Avaliações</TableCell>
                <TableCell align="center">Nota Trimestral</TableCell>
                <TableCell align="center">Média Anual</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alunos.map((aluno) => {
                const avaliacaoAluno = avaliacoes.find(av => av.aluno._id === aluno._id);
                const mediaAnual = getMediaAnualAluno(aluno._id);
                
                return (
                  <TableRow key={aluno._id} hover>
                    <TableCell>
                      <Chip label={aluno.matricula} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <strong>{aluno.nome}</strong>
                    </TableCell>
                    <TableCell align="center">
                      {avaliacaoAluno ? (
                        <Chip 
                          label={`${avaliacaoAluno.avaliacoes.length} avaliação(ões)`}
                          size="small"
                          color="primary"
                        />
                      ) : (
                        <Chip label="Sem avaliações" size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {avaliacaoAluno ? (
                        <Chip
                          label={avaliacaoAluno.notaTrimestre?.toFixed(2) || '0.00'}
                          color={getNotaColor(avaliacaoAluno.notaTrimestre)}
                          sx={{ fontWeight: 'bold', minWidth: 60 }}
                        />
                      ) : (
                        <Typography color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={mediaAnual}
                        color={getNotaColor(parseFloat(mediaAnual))}
                        variant="outlined"
                        sx={{ fontWeight: 'bold', minWidth: 60 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Lançar/Editar Avaliações">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(aluno)}
                          size="small"
                        >
                          {avaliacaoAluno ? <Edit /> : <Add />}
                        </IconButton>
                      </Tooltip>
                      {avaliacaoAluno && (
                        <Tooltip title="Excluir Avaliações">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteAvaliacao(avaliacaoAluno._id)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {filtros.turma && filtros.disciplina && alunos.length === 0 && !loading && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Nenhum aluno encontrado nesta turma.
          </Typography>
        </Paper>
      )}

      {(!filtros.turma || !filtros.disciplina) && !loading && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Assessment sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Selecione uma turma e disciplina para começar
          </Typography>
        </Paper>
      )}

      {/* Diálogo de Avaliações */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {alunoSelecionado && (
            <Box>
              <Typography variant="h6">
                Avaliações - {alunoSelecionado.nome}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Matrícula: {alunoSelecionado.matricula} | {filtros.trimestre}º Trimestre/{filtros.ano}
              </Typography>
            </Box>
          )}
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleAddAvaliacao}
              fullWidth
            >
              Adicionar Nova Avaliação
            </Button>
          </Box>

          {novasAvaliacoes.map((avaliacao, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle2" color="primary">
                    Avaliação #{index + 1}
                  </Typography>
                  {novasAvaliacoes.length > 1 && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveAvaliacao(index)}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Tipo"
                      value={avaliacao.tipo}
                      onChange={(e) => handleAvaliacaoChange(index, 'tipo', e.target.value)}
                    >
                      {TIPOS_AVALIACAO.map((tipo) => (
                        <MenuItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Descrição"
                      value={avaliacao.descricao}
                      onChange={(e) => handleAvaliacaoChange(index, 'descricao', e.target.value)}
                      placeholder="Ex: Prova Bimestral"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Nota (0-10)"
                      value={avaliacao.nota}
                      onChange={(e) => handleAvaliacaoChange(index, 'nota', e.target.value)}
                      inputProps={{ min: 0, max: 10, step: 0.1 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Peso"
                      value={avaliacao.peso}
                      onChange={(e) => handleAvaliacaoChange(index, 'peso', e.target.value)}
                      inputProps={{ min: 0.1, step: 0.1 }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}

          <Divider sx={{ my: 2 }} />

          <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Nota Trimestral Calculada
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {calcularNotaTrimestral(novasAvaliacoes)}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                Calculada automaticamente com base nas notas e pesos
              </Typography>
            </CardContent>
          </Card>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<Cancel />}>
            Cancelar
          </Button>
          <Button
            onClick={handleSalvarAvaliacoes}
            variant="contained"
            startIcon={<Save />}
          >
            Salvar Avaliações
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Avaliacoes;
