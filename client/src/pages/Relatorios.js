import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  TextField,
  Fade,
  Zoom,
} from '@mui/material';
import {
  PictureAsPdf,
  Download,
  Assessment,
  TrendingUp,
  Warning,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import {
  turmaService,
  alunoService,
  disciplinaService,
  relatorioService,
} from '../services';

const Relatorios = () => {
  const [turmas, setTurmas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  
  // Filtros
  const [turmaSelecionada, setTurmaSelecionada] = useState('');
  const [alunoSelecionado, setAlunoSelecionado] = useState('');
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState('');
  const [trimestre, setTrimestre] = useState('');
  const [ano, setAno] = useState(new Date().getFullYear());
  
  // Estados de loading
  const [loading, setLoading] = useState(false);
  const [loadingMatriz, setLoadingMatriz] = useState(false);
  const [loadingMapaCalor, setLoadingMapaCalor] = useState(false);
  const [loadingNaoTrabalhadas, setLoadingNaoTrabalhadas] = useState(false);
  
  // Dados dos relatórios avançados
  const [matrizHabilidades, setMatrizHabilidades] = useState(null);
  const [mapaCalor, setMapaCalor] = useState(null);
  const [habilidadesNaoTrabalhadas, setHabilidadesNaoTrabalhadas] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (turmaSelecionada) {
      carregarAlunosDaTurma();
    }
  }, [turmaSelecionada]);

  const carregarDados = async () => {
    try {
      const [turmasData, disciplinasData] = await Promise.all([
        turmaService.getAll(),
        disciplinaService.getAll(),
      ]);
      setTurmas(turmasData);
      setDisciplinas(disciplinasData);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    }
  };

  const carregarAlunosDaTurma = async () => {
    try {
      const alunosData = await alunoService.getAll({ turma: turmaSelecionada });
      setAlunos(alunosData);
    } catch (error) {
      toast.error('Erro ao carregar alunos');
    }
  };

  const handleGerarBoletim = async () => {
    if (!alunoSelecionado) {
      toast.warning('Selecione um aluno');
      return;
    }

    try {
      setLoading(true);
      await relatorioService.gerarBoletimAluno(alunoSelecionado, ano);
      toast.success('Boletim gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar boletim');
    } finally {
      setLoading(false);
    }
  };

  const handleGerarRelatorioTurma = async () => {
    if (!turmaSelecionada) {
      toast.warning('Selecione uma turma');
      return;
    }

    try {
      setLoading(true);
      const params = {};
      if (disciplinaSelecionada) params.disciplinaId = disciplinaSelecionada;
      if (trimestre) params.trimestre = trimestre;
      if (ano) params.ano = ano;

      await relatorioService.gerarRelatorioTurma(turmaSelecionada, params);
      toast.success('Relatório de turma gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar relatório de turma');
    } finally {
      setLoading(false);
    }
  };

  const handleCarregarMatrizHabilidades = async () => {
    if (!alunoSelecionado) {
      toast.warning('Selecione um aluno');
      return;
    }

    try {
      setLoadingMatriz(true);
      const params = {};
      if (ano) params.ano = ano;
      if (turmaSelecionada) params.turmaId = turmaSelecionada;
      if (disciplinaSelecionada) params.disciplinaId = disciplinaSelecionada;

      const data = await relatorioService.getMatrizHabilidades(alunoSelecionado, params);
      setMatrizHabilidades(data);
      toast.success('Matriz de habilidades carregada!');
    } catch (error) {
      toast.error('Erro ao carregar matriz de habilidades');
    } finally {
      setLoadingMatriz(false);
    }
  };

  const handleCarregarMapaCalor = async () => {
    if (!turmaSelecionada) {
      toast.warning('Selecione uma turma');
      return;
    }

    try {
      setLoadingMapaCalor(true);
      const params = {};
      if (disciplinaSelecionada) params.disciplinaId = disciplinaSelecionada;
      if (trimestre) params.trimestre = trimestre;

      const data = await relatorioService.getMapaCalor(turmaSelecionada, params);
      setMapaCalor(data);
      toast.success('Mapa de calor carregado!');
    } catch (error) {
      toast.error('Erro ao carregar mapa de calor');
    } finally {
      setLoadingMapaCalor(false);
    }
  };

  const handleCarregarHabilidadesNaoTrabalhadas = async () => {
    if (!turmaSelecionada) {
      toast.warning('Selecione uma turma');
      return;
    }

    try {
      setLoadingNaoTrabalhadas(true);
      const params = {};
      if (disciplinaSelecionada) params.disciplinaId = disciplinaSelecionada;
      if (trimestre) params.trimestre = trimestre;

      const data = await relatorioService.getHabilidadesNaoTrabalhadas(turmaSelecionada, params);
      setHabilidadesNaoTrabalhadas(data);
      toast.success('Habilidades não trabalhadas carregadas!');
    } catch (error) {
      toast.error('Erro ao carregar habilidades não trabalhadas');
    } finally {
      setLoadingNaoTrabalhadas(false);
    }
  };

  const getNivelColor = (nivel) => {
    const colors = {
      'não-desenvolvido': '#f44336',
      'em-desenvolvimento': '#ff9800',
      'desenvolvido': '#4caf50',
      'plenamente-desenvolvido': '#2196f3',
    };
    return colors[nivel] || '#999';
  };

  const getNivelLabel = (nivel) => {
    const labels = {
      'não-desenvolvido': 'Não Desenvolvido',
      'em-desenvolvimento': 'Em Desenvolvimento',
      'desenvolvido': 'Desenvolvido',
      'plenamente-desenvolvido': 'Plenamente Desenvolvido',
    };
    return labels[nivel] || '-';
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Zoom in={true} timeout={400}>
        <Typography variant="h4" gutterBottom fontWeight="600" sx={{ mb: 3 }}>
          📊 Relatórios e Análises
        </Typography>
      </Zoom>

      {/* Filtros */}
      <Fade in={true} timeout={600}>
        <Paper 
          sx={{ 
            p: 3, 
            mb: 3,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            }
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="600">
          Filtros
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Turma</InputLabel>
              <Select
                value={turmaSelecionada}
                onChange={(e) => setTurmaSelecionada(e.target.value)}
                label="Turma"
              >
                <MenuItem value="">Todas</MenuItem>
                {turmas.map((turma) => (
                  <MenuItem key={turma._id} value={turma._id}>
                    {turma.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth disabled={!turmaSelecionada}>
              <InputLabel>Aluno</InputLabel>
              <Select
                value={alunoSelecionado}
                onChange={(e) => setAlunoSelecionado(e.target.value)}
                label="Aluno"
              >
                <MenuItem value="">Selecione</MenuItem>
                {alunos.map((aluno) => (
                  <MenuItem key={aluno._id} value={aluno._id}>
                    {aluno.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Disciplina</InputLabel>
              <Select
                value={disciplinaSelecionada}
                onChange={(e) => setDisciplinaSelecionada(e.target.value)}
                label="Disciplina"
              >
                <MenuItem value="">Todas</MenuItem>
                {disciplinas.map((disc) => (
                  <MenuItem key={disc._id} value={disc._id}>
                    {disc.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Trimestre</InputLabel>
              <Select
                value={trimestre}
                onChange={(e) => setTrimestre(e.target.value)}
                label="Trimestre"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value={1}>1º Trimestre</MenuItem>
                <MenuItem value={2}>2º Trimestre</MenuItem>
                <MenuItem value={3}>3º Trimestre</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="number"
              label="Ano"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>
      </Fade>

      {/* Relatórios em PDF */}
      <Zoom in={true} timeout={700}>
        <Typography variant="h5" gutterBottom fontWeight="600" sx={{ mt: 4, mb: 2 }}>
          📄 Relatórios em PDF
        </Typography>
      </Zoom>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={800}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                }
              }}
            >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PictureAsPdf sx={{ fontSize: 40, color: '#00CED1', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Boletim Individual</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Boletim completo do aluno com todas as notas
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                • Notas por disciplina e trimestre<br />
                • Média anual calculada<br />
                • Situação do aluno (aprovado/recuperação)
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <Download />}
                onClick={handleGerarBoletim}
                disabled={loading || !alunoSelecionado}
                fullWidth
              >
                Gerar Boletim
              </Button>
            </CardActions>
          </Card>
          </Fade>
        </Grid>

        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={900}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                }
              }}
            >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ fontSize: 40, color: '#00CED1', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Desempenho da Turma</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Relatório completo de desempenho por turma
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                • Estatísticas gerais da turma<br />
                • Desempenho por aluno e disciplina<br />
                • Médias por trimestre
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <Download />}
                onClick={handleGerarRelatorioTurma}
                disabled={loading || !turmaSelecionada}
                fullWidth
              >
                Gerar Relatório
              </Button>
            </CardActions>
          </Card>
          </Fade>
        </Grid>
      </Grid>

      {/* Relatórios Avançados de Habilidades */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        🎯 Relatórios Avançados de Habilidades
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ fontSize: 40, color: '#4caf50', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Matriz de Habilidades</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Evolução de habilidades do aluno
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                • Lista de todas as habilidades avaliadas<br />
                • Evolução ao longo dos trimestres<br />
                • Percentual de desenvolvimento
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="success"
                startIcon={loadingMatriz ? <CircularProgress size={20} /> : <Assessment />}
                onClick={handleCarregarMatrizHabilidades}
                disabled={loadingMatriz || !alunoSelecionado}
                fullWidth
              >
                Visualizar Matriz
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ fontSize: 40, color: '#ff9800', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Mapa de Calor</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Visualização por turma
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                • Comparativo entre todos os alunos<br />
                • Identificação de padrões<br />
                • Análise visual de desenvolvimento
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="warning"
                startIcon={loadingMapaCalor ? <CircularProgress size={20} /> : <Assessment />}
                onClick={handleCarregarMapaCalor}
                disabled={loadingMapaCalor || !turmaSelecionada}
                fullWidth
              >
                Visualizar Mapa
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning sx={{ fontSize: 40, color: '#f44336', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Habilidades Pendentes</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Não trabalhadas na turma
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                • Habilidades cadastradas mas não avaliadas<br />
                • Identificação de lacunas<br />
                • Planejamento pedagógico
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="error"
                startIcon={loadingNaoTrabalhadas ? <CircularProgress size={20} /> : <Warning />}
                onClick={handleCarregarHabilidadesNaoTrabalhadas}
                disabled={loadingNaoTrabalhadas || !turmaSelecionada}
                fullWidth
              >
                Identificar Pendentes
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Visualização da Matriz de Habilidades */}
      {matrizHabilidades && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Matriz de Habilidades - {matrizHabilidades.aluno.nome}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Matrícula: {matrizHabilidades.aluno.matricula} | Turma: {matrizHabilidades.aluno.turma}
          </Typography>
          
          {matrizHabilidades.habilidades.length === 0 ? (
            <Alert severity="info">Nenhuma habilidade avaliada ainda</Alert>
          ) : (
            <TableContainer sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Código</strong></TableCell>
                    <TableCell><strong>Descrição</strong></TableCell>
                    <TableCell><strong>Disciplina</strong></TableCell>
                    <TableCell align="center"><strong>Evolução</strong></TableCell>
                    <TableCell align="center"><strong>Avaliações</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {matrizHabilidades.habilidades.map((hab) => (
                    <TableRow key={hab.id}>
                      <TableCell>{hab.codigo}</TableCell>
                      <TableCell>{hab.descricao}</TableCell>
                      <TableCell>{hab.disciplina}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`${hab.evolucao.toFixed(0)}%`}
                          size="small"
                          sx={{
                            bgcolor: hab.evolucao >= 75 ? '#4caf50' : hab.evolucao >= 50 ? '#ffeb3b' : '#f44336',
                            color: hab.evolucao >= 50 ? '#000' : '#fff',
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">{hab.niveis.length}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* Visualização do Mapa de Calor */}
      {mapaCalor && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Mapa de Calor - Turma {mapaCalor.turma.nome}
          </Typography>
          
          {Object.keys(mapaCalor.matriz).length === 0 ? (
            <Alert severity="info">Nenhum dado disponível ainda</Alert>
          ) : (
            <TableContainer sx={{ mt: 2, maxHeight: 600 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 150 }}><strong>Aluno</strong></TableCell>
                    {mapaCalor.habilidades.map((hab) => (
                      <TableCell key={hab.id} align="center" sx={{ minWidth: 100 }}>
                        <strong>{hab.codigo}</strong>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(mapaCalor.matriz).map(([alunoId, dados]) => (
                    <TableRow key={alunoId}>
                      <TableCell>{dados.nome}</TableCell>
                      {mapaCalor.habilidades.map((hab) => {
                        const habData = dados.habilidades[hab.id];
                        return (
                          <TableCell
                            key={hab.id}
                            align="center"
                            sx={{
                              bgcolor: habData.nivel ? getNivelColor(habData.nivel) : '#f5f5f5',
                              color: habData.percentual >= 50 ? '#000' : '#fff',
                            }}
                          >
                            {habData.percentual > 0 ? `${habData.percentual}%` : '-'}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip label="Não Desenvolvido (25%)" sx={{ bgcolor: '#f44336', color: '#fff' }} />
            <Chip label="Em Desenvolvimento (50%)" sx={{ bgcolor: '#ff9800', color: '#fff' }} />
            <Chip label="Desenvolvido (75%)" sx={{ bgcolor: '#4caf50', color: '#000' }} />
            <Chip label="Plenamente Desenvolvido (100%)" sx={{ bgcolor: '#2196f3', color: '#fff' }} />
          </Box>
        </Paper>
      )}

      {/* Visualização de Habilidades Não Trabalhadas */}
      {habilidadesNaoTrabalhadas && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Habilidades Não Trabalhadas
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Chip label={`Total: ${habilidadesNaoTrabalhadas.total}`} sx={{ mr: 1 }} />
            <Chip label={`Trabalhadas: ${habilidadesNaoTrabalhadas.trabalhadas}`} color="success" sx={{ mr: 1 }} />
            <Chip label={`Pendentes: ${habilidadesNaoTrabalhadas.naoTrabalhadas.length}`} color="error" />
          </Box>

          {habilidadesNaoTrabalhadas.naoTrabalhadas.length === 0 ? (
            <Alert severity="success">Todas as habilidades foram trabalhadas!</Alert>
          ) : (
            <TableContainer sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Código</strong></TableCell>
                    <TableCell><strong>Descrição</strong></TableCell>
                    <TableCell><strong>Disciplina</strong></TableCell>
                    <TableCell align="center"><strong>Trimestre</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {habilidadesNaoTrabalhadas.naoTrabalhadas.map((hab) => (
                    <TableRow key={hab.id}>
                      <TableCell>{hab.codigo}</TableCell>
                      <TableCell>{hab.descricao}</TableCell>
                      <TableCell>{hab.disciplina}</TableCell>
                      <TableCell align="center">{hab.trimestre}º</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default Relatorios;
