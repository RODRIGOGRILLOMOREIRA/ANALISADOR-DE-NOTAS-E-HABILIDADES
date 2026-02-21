import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Fade,
  Zoom,
  IconButton,
  Tooltip,
  Badge,
  Button,
  useTheme,
} from '@mui/material';
import {
  AssessmentOutlined,
  SchoolOutlined,
  CheckCircleOutlined,
  TrendingUpOutlined,
  PeopleOutlined,
  EventAvailableOutlined,
  WarningAmberOutlined,
  EventBusyOutlined,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  EventNote as EventNoteIcon,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as TooltipChart,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { dashboardService, turmaService, disciplinaService, alunoService, frequenciaService } from '../services';
import { toast } from 'react-toastify';
import PageHeader from '../components/PageHeader';
import { Dashboard as DashboardIcon } from '@mui/icons-material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  TooltipChart,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [turmas, setTurmas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [filters, setFilters] = useState({
    turma: '',
    aluno: '',
    disciplina: '',
    ano: new Date().getFullYear(),
    trimestre: '',
    dataInicio: '',
    dataFim: '',
    pontoCorte: 6.0,
  });

  const [estatisticas, setEstatisticas] = useState(null);
  const [desempenhoDisciplina, setDesempenhoDisciplina] = useState([]);
  const [evolucaoTrimestral, setEvolucaoTrimestral] = useState([]);
  const [evolucaoHabilidades, setEvolucaoHabilidades] = useState(null);
  const [distribuicaoHabilidades, setDistribuicaoHabilidades] = useState(null);
  const [dashboardFrequencia, setDashboardFrequencia] = useState(null);
  const [contagemAlunos, setContagemAlunos] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filtroFrequencia, setFiltroFrequencia] = useState('todos'); // 'todos', 'verde', 'amarelo', 'vermelho'
  const [buscaAluno, setBuscaAluno] = useState('');
  const [tabelaVisivel, setTabelaVisivel] = useState(true);
  const theme = useTheme();

  // Helper para formatar período de frequência
  const getPeriodoFrequencia = () => {
    if (filters.dataInicio && filters.dataFim) {
      const inicio = new Date(filters.dataInicio + 'T12:00:00').toLocaleDateString('pt-BR');
      const fim = new Date(filters.dataFim + 'T12:00:00').toLocaleDateString('pt-BR');
      return `Período: ${inicio} a ${fim}`;
    }
    if (filters.dataInicio) {
      const dia = new Date(filters.dataInicio + 'T12:00:00').toLocaleDateString('pt-BR');
      return `Dia: ${dia}`;
    }
    if (filters.trimestre) {
      return `${filters.trimestre}º Trimestre de ${filters.ano}`;
    }
    if (filters.ano) {
      return `Ano: ${filters.ano}`;
    }
    return 'Geral';
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (filters.turma) {
      loadAlunos();
    } else {
      setAlunos([]);
      setFilters(prev => ({ ...prev, aluno: '' }));
    }
  }, [filters.turma]);

  useEffect(() => {
    loadDashboardData();
  }, [filters]);

  // Auto-refresh a cada 10 segundos quando há filtros ativos, 30 segundos caso contrário
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      // Refresh mais frequente quando há filtros específicos (dia, período)
      const hasSpecificFilters = filters.dataInicio || filters.turma || filters.aluno || filters.disciplina;
      const refreshInterval = hasSpecificFilters ? 10000 : 30000;
      
      interval = setInterval(() => {
        console.log('🔄 Auto-refresh do dashboard...');
        loadDashboardData();
      }, refreshInterval);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, filters]);

  const loadInitialData = async () => {
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

  const loadAlunos = async () => {
    try {
      const alunosData = await alunoService.getAll({ turma: filters.turma });
      setAlunos(alunosData);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      setAlunos([]);
    }
  };

  const loadDashboardData = async () => {
    try {
      const params = {};
      if (filters.turma) params.turma = filters.turma;
      if (filters.aluno) params.aluno = filters.aluno;
      if (filters.disciplina) params.disciplina = filters.disciplina;
      if (filters.ano) params.ano = filters.ano;
      if (filters.trimestre) params.trimestre = filters.trimestre;
      if (filters.dataInicio) params.dataInicio = filters.dataInicio;
      if (filters.dataFim) params.dataFim = filters.dataFim;
      if (filters.pontoCorte) params.pontoCorte = filters.pontoCorte;

      const [stats, desempenho, evolucao, evolHab, distHab, dashFreq, contAlunos] = await Promise.all([
        dashboardService.getEstatisticas(params),
        dashboardService.getDesempenhoDisciplina(params),
        dashboardService.getEvolucaoTrimestral(params),
        dashboardService.getEvolucaoHabilidades(params),
        dashboardService.getDistribuicaoNiveisHabilidades(params),
        frequenciaService.getDashboard(params),
        dashboardService.getContagemAlunos(params),
      ]);

      setEstatisticas(stats);
      setDesempenhoDisciplina(desempenho);
      setEvolucaoTrimestral(evolucao);
      setEvolucaoHabilidades(evolHab);
      setDistribuicaoHabilidades(distHab);
      setDashboardFrequencia(dashFreq);
      setContagemAlunos(contAlunos);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    }
  };

  const chartDataDesempenho = {
    labels: desempenhoDisciplina.map((d) => d.disciplina),
    datasets: [
      {
        label: 'Média por Disciplina',
        data: desempenhoDisciplina.map((d) => d.media),
        backgroundColor: 'rgba(25, 118, 210, 0.6)',
        borderColor: 'rgba(25, 118, 210, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartDataEvolucao = {
    labels: evolucaoTrimestral.map((e) => `${e.trimestre}º Trimestre`),
    datasets: [
      {
        label: 'Evolução da Média',
        data: evolucaoTrimestral.map((e) => e.media),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const chartDataAprovacao = estatisticas ? {
    labels: ['Aprovados', 'Reprovados'],
    datasets: [
      {
        data: [estatisticas.aprovados, estatisticas.reprovados],
        backgroundColor: ['rgba(76, 175, 80, 0.6)', 'rgba(244, 67, 54, 0.6)'],
        borderColor: ['rgba(76, 175, 80, 1)', 'rgba(244, 67, 54, 1)'],
        borderWidth: 1,
      },
    ],
  } : null;

  // Gráficos de Habilidades
  const chartDataEvolucaoHabilidades = evolucaoHabilidades ? {
    labels: ['1º Trimestre', '2º Trimestre', '3º Trimestre'],
    datasets: [
      {
        label: 'Evolução de Habilidades (%)',
        data: [
          parseFloat(evolucaoHabilidades[1]?.percentual || 0),
          parseFloat(evolucaoHabilidades[2]?.percentual || 0),
          parseFloat(evolucaoHabilidades[3]?.percentual || 0)
        ],
        borderColor: 'rgb(156, 39, 176)',
        backgroundColor: 'rgba(156, 39, 176, 0.2)',
        tension: 0.1,
      },
    ],
  } : null;

  const chartDataDistribuicaoHabilidades = distribuicaoHabilidades ? {
    labels: ['Não Desenvolvido', 'Em Desenvolvimento', 'Desenvolvido', 'Plenamente Desenvolvido'],
    datasets: [
      {
        data: [
          distribuicaoHabilidades.distribuicao?.['nao-desenvolvido']?.quantidade || 0,
          distribuicaoHabilidades.distribuicao?.['em-desenvolvimento']?.quantidade || 0,
          distribuicaoHabilidades.distribuicao?.['desenvolvido']?.quantidade || 0,
          distribuicaoHabilidades.distribuicao?.['plenamente-desenvolvido']?.quantidade || 0,
        ],
        backgroundColor: [
          'rgba(244, 67, 54, 0.6)',
          'rgba(255, 152, 0, 0.6)',
          'rgba(33, 150, 243, 0.6)',
          'rgba(76, 175, 80, 0.6)',
        ],
        borderColor: [
          'rgba(244, 67, 54, 1)',
          'rgba(255, 152, 0, 1)',
          'rgba(33, 150, 243, 1)',
          'rgba(76, 175, 80, 1)',
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  return (
    <Container maxWidth="xl">
      <PageHeader 
        title="Dashboard Analítico"
        subtitle="Visualize métricas e indicadores de desempenho acadêmico"
        icon={DashboardIcon}
      />

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          {/* LINHA 1: Turma, Aluno, Disciplina */}
          <Grid item xs={12} sm={4} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Turma</InputLabel>
              <Select
                value={filters.turma}
                label="Turma"
                onChange={(e) => setFilters({ ...filters, turma: e.target.value, aluno: '' })}
              >
                <MenuItem value="">Todas</MenuItem>
                {turmas.map((t) => (
                  <MenuItem key={t._id} value={t._id}>
                    {t.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <FormControl fullWidth size="small" disabled={!filters.turma}>
              <InputLabel>Aluno</InputLabel>
              <Select
                value={filters.aluno}
                label="Aluno"
                onChange={(e) => setFilters({ ...filters, aluno: e.target.value })}
              >
                <MenuItem value="">Todos</MenuItem>
                {alunos.map((a) => (
                  <MenuItem key={a._id} value={a._id}>
                    {a.nome} - {a.matricula}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Disciplina</InputLabel>
              <Select
                value={filters.disciplina}
                label="Disciplina"
                onChange={(e) => setFilters({ ...filters, disciplina: e.target.value })}
              >
                <MenuItem value="">Todas</MenuItem>
                {disciplinas.map((d) => (
                  <MenuItem key={d._id} value={d._id}>
                    {d.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* LINHA 2: Ano, Trimestre, Data Início, Data Fim, Ponto de Corte */}
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth size="small">
              <InputLabel>Ano</InputLabel>
              <Select
                value={filters.ano}
                label="Ano"
                onChange={(e) => setFilters({ ...filters, ano: e.target.value })}
              >
                <MenuItem value={2024}>2024</MenuItem>
                <MenuItem value={2025}>2025</MenuItem>
                <MenuItem value={2026}>2026</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth size="small">
              <InputLabel>Trimestre</InputLabel>
              <Select
                value={filters.trimestre}
                label="Trimestre"
                onChange={(e) => setFilters({ ...filters, trimestre: e.target.value })}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value={1}>1º Trimestre</MenuItem>
                <MenuItem value={2}>2º Trimestre</MenuItem>
                <MenuItem value={3}>3º Trimestre</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Data Início"
              value={filters.dataInicio}
              onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Data Fim"
              value={filters.dataFim}
              onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: filters.dataInicio }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth size="small">
              <InputLabel>Ponto de Corte</InputLabel>
              <Select
                value={filters.pontoCorte}
                label="Ponto de Corte"
                onChange={(e) => setFilters({ ...filters, pontoCorte: e.target.value })}
              >
                <MenuItem value={5.0}>5.0</MenuItem>
                <MenuItem value={6.0}>6.0</MenuItem>
                <MenuItem value={7.0}>7.0</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Cards de Estatísticas */}
      {estatisticas && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Zoom in={true} timeout={300}>
              <Card 
                sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(102, 126, 234, 0.4)',
                  }
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography sx={{ opacity: 0.9, fontSize: '0.875rem' }} gutterBottom>
                        Total de Avaliações
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ color: '#4169E1' }}>{estatisticas.totalAvaliacoes}</Typography>
                    </Box>
                    <AssessmentOutlined sx={{ fontSize: 48, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Zoom in={true} timeout={400}>
              <Card 
                sx={{ 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(79, 172, 254, 0.4)',
                  }
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography sx={{ opacity: 0.9, fontSize: '0.875rem' }} gutterBottom>
                        Média Geral
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ color: '#4169E1' }}>{estatisticas.mediaGeral.toFixed(2)}</Typography>
                    </Box>
                    <TrendingUpOutlined sx={{ fontSize: 48, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Zoom in={true} timeout={500}>
              <Card 
                sx={{ 
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(67, 233, 123, 0.4)',
                  }
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography sx={{ opacity: 0.9, fontSize: '0.875rem' }} gutterBottom>
                        Aprovados
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ color: '#4169E1' }}>{estatisticas.aprovados}</Typography>
                    </Box>
                    <CheckCircleOutlined sx={{ fontSize: 48, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Zoom in={true} timeout={600}>
              <Card 
                sx={{ 
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  color: 'white',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(250, 112, 154, 0.4)',
                  }
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography sx={{ opacity: 0.9, fontSize: '0.875rem' }} gutterBottom>
                        % Aprovação
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ color: '#4169E1' }}>{estatisticas.percentualAprovacao}%</Typography>
                    </Box>
                    <SchoolOutlined sx={{ fontSize: 48, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>
      )}

      {/* Gráficos */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={800}>
            <Paper 
              sx={{ 
                p: 3,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="600">
                Desempenho por Disciplina
              </Typography>
              <Box sx={{ height: 300 }}>
              <Bar data={chartDataDesempenho} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
          </Fade>
        </Grid>
        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={900}>
            <Paper 
              sx={{ 
                p: 3,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="600">
                Aprovação x Reprovação
              </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              {chartDataAprovacao && (
                <Pie data={chartDataAprovacao} options={{ maintainAspectRatio: false }} />
              )}
            </Box>
          </Paper>
          </Fade>
        </Grid>
        <Grid item xs={12}>
          <Fade in={true} timeout={1000}>
            <Paper 
              sx={{ 
                p: 3,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="600">
                Evolução Trimestral
              </Typography>
            <Box sx={{ height: 300 }}>
              <Line data={chartDataEvolucao} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
          </Fade>
        </Grid>

        {/* Gráficos de Habilidades */}
        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={1100}>
            <Paper 
              sx={{ 
                p: 3,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="600">
                📚 Evolução de Habilidades por Trimestre
              </Typography>
            <Box sx={{ height: 300 }}>
              {chartDataEvolucaoHabilidades ? (
                <Line 
                  data={chartDataEvolucaoHabilidades} 
                  options={{ 
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          callback: function(value) {
                            return value + '%';
                          }
                        }
                      }
                    }
                  }} 
                />
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 10 }}>
                  Nenhum dado de habilidades disponível
                </Typography>
              )}
            </Box>
          </Paper>
          </Fade>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={1200}>
            <Paper 
              sx={{ 
                p: 3,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="600">
                🎯 Distribuição de Níveis de Habilidades
              </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              {chartDataDistribuicaoHabilidades && distribuicaoHabilidades?.total > 0 ? (
                <Pie 
                  data={chartDataDistribuicaoHabilidades} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const nivel = label.toLowerCase().replace(' ', '-');
                            const percentual = distribuicaoHabilidades.distribuicao?.[nivel]?.percentual || 0;
                            return `${label}: ${value} (${percentual}%)`;
                          }
                        }
                      }
                    }
                  }} 
                />
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 10 }}>
                  Nenhuma habilidade avaliada
                </Typography>
              )}
            </Box>
          </Paper>
          </Fade>
        </Grid>

        {distribuicaoHabilidades && distribuicaoHabilidades.total > 0 && (
          <Grid item xs={12}>
            <Fade in={true} timeout={1300}>
              <Paper 
                sx={{ 
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight="600">
                  📊 Estatísticas de Habilidades
                </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: 'error.light' }}>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Não Desenvolvido
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#4169E1', fontWeight: 600 }}>
                        {distribuicaoHabilidades.distribuicao?.['nao-desenvolvido']?.quantidade || 0}
                      </Typography>
                      <Typography variant="caption">
                        {distribuicaoHabilidades.distribuicao?.['nao-desenvolvido']?.percentual || 0}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: 'warning.light' }}>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Em Desenvolvimento
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#4169E1', fontWeight: 600 }}>
                        {distribuicaoHabilidades.distribuicao?.['em-desenvolvimento']?.quantidade || 0}
                      </Typography>
                      <Typography variant="caption">
                        {distribuicaoHabilidades.distribuicao?.['em-desenvolvimento']?.percentual || 0}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: 'info.light' }}>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Desenvolvido
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#4169E1', fontWeight: 600 }}>
                        {distribuicaoHabilidades.distribuicao?.['desenvolvido']?.quantidade || 0}
                      </Typography>
                      <Typography variant="caption">
                        {distribuicaoHabilidades.distribuicao?.['desenvolvido']?.percentual || 0}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: 'success.light' }}>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Plenamente Desenvolvido
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#4169E1', fontWeight: 600 }}>
                        {distribuicaoHabilidades.distribuicao?.['plenamente-desenvolvido']?.quantidade || 0}
                      </Typography>
                      <Typography variant="caption">
                        {distribuicaoHabilidades.distribuicao?.['plenamente-desenvolvido']?.percentual || 0}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
            </Fade>
          </Grid>
        )}

        {/* Seção de Frequências em Tempo Real */}
        {dashboardFrequencia && (
          <>
            <Grid item xs={12}>
              <Fade in={true} timeout={1400}>
                <Paper 
                  sx={{ 
                    p: 3,
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom fontWeight="600">
                        📅 Dashboard de Frequência
                      </Typography>
                      <Chip 
                        label={getPeriodoFrequencia()} 
                        color="primary" 
                        size="small" 
                        icon={<EventAvailableOutlined />}
                      />
                    </Box>
                    <Tooltip title={autoRefresh ? "Auto-atualização ativada" : "Auto-atualização desativada"}>
                      <IconButton 
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        color={autoRefresh ? "primary" : "default"}
                      >
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                
                {/* Cards de Estatísticas de Frequência */}
                <Grid container spacing={1.5} sx={{ mb: 3 }}>
                  {/* Card de Total de Alunos */}
                  {contagemAlunos && (
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {contagemAlunos.contexto === 'da turma' ? 'Alunos da Turma' : 'Total de Alunos'}
                          </Typography>
                          <Typography variant="h3" sx={{ fontWeight: 700, my: 1, color: '#4169E1' }}>
                            {contagemAlunos.totalAlunos || 0}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.9 }}>
                            {contagemAlunos.contexto === 'da turma' ? 'Matriculados na turma' : 'Matriculados na escola'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>Taxa de Presença</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, my: 1, color: '#4169E1' }}>
                          {dashboardFrequencia.estatisticasGerais?.percentualPresenca?.toFixed(1) || 0}%
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          {dashboardFrequencia.estatisticasGerais?.presencas || 0} de {dashboardFrequencia.estatisticasGerais?.total || 0} registros
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Card sx={{ bgcolor: 'error.main', color: 'white' }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>Taxa de Faltas</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, my: 1, color: '#4169E1' }}>
                          {((dashboardFrequencia.estatisticasGerais?.faltas || 0) / (dashboardFrequencia.estatisticasGerais?.total || 1) * 100).toFixed(1)}%
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          {dashboardFrequencia.estatisticasGerais?.faltas || 0} faltas registradas
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>Taxa de Justificadas</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, my: 1, color: '#4169E1' }}>
                          {((dashboardFrequencia.estatisticasGerais?.faltasJustificadas || 0) / (dashboardFrequencia.estatisticasGerais?.total || 1) * 100).toFixed(1)}%
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          {dashboardFrequencia.estatisticasGerais?.faltasJustificadas || 0} justificativas
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>Total de Dias Registrados</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, my: 1, color: '#4169E1' }}>
                          {dashboardFrequencia.estatisticasGerais?.totalDiasRegistrados || 0}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          Dias com frequência lançada
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Alunos com Frequência Detalhada */}
                {dashboardFrequencia && dashboardFrequencia.alunosPorFrequencia && (
                  <Box sx={{ mt: 3 }}>
                    {/* Filtro de Visualização por Cor - Modernizado */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        <Button 
                          variant={filtroFrequencia === 'todos' ? 'contained' : 'outlined'}
                          onClick={() => setFiltroFrequencia('todos')}
                          sx={{ 
                            borderRadius: 2,
                            px: 2.5,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            backgroundColor: filtroFrequencia === 'todos' ? '#1976d2' : 'transparent',
                            borderColor: '#1976d2',
                            color: filtroFrequencia === 'todos' ? 'white' : '#1976d2',
                            '&:hover': { 
                              backgroundColor: filtroFrequencia === 'todos' ? '#1565c0' : '#e3f2fd',
                              borderColor: '#1976d2'
                            },
                            boxShadow: filtroFrequencia === 'todos' ? 2 : 0,
                          }}
                        >
                          🔵 TODOS ({dashboardFrequencia.alunosPorFrequencia?.length || 0})
                        </Button>
                        
                        <Button 
                          variant={filtroFrequencia === 'verde' ? 'contained' : 'outlined'}
                          onClick={() => setFiltroFrequencia('verde')}
                          sx={{ 
                            borderRadius: 2,
                            px: 2.5,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            backgroundColor: filtroFrequencia === 'verde' ? '#4caf50' : 'transparent',
                            borderColor: '#4caf50',
                            color: filtroFrequencia === 'verde' ? 'white' : '#4caf50',
                            '&:hover': { 
                              backgroundColor: filtroFrequencia === 'verde' ? '#388e3c' : '#e8f5e9',
                              borderColor: '#4caf50'
                            },
                            boxShadow: filtroFrequencia === 'verde' ? 2 : 0,
                          }}
                        >
                          🟢 VERDE ({dashboardFrequencia.alunosPorFrequencia?.filter((a) => a.percentualPresenca >= 80).length || 0})
                        </Button>
                        
                        <Button 
                          variant={filtroFrequencia === 'amarelo' ? 'contained' : 'outlined'}
                          onClick={() => setFiltroFrequencia('amarelo')}
                          sx={{ 
                            borderRadius: 2,
                            px: 2.5,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            backgroundColor: filtroFrequencia === 'amarelo' ? '#ff9800' : 'transparent',
                            borderColor: '#ff9800',
                            color: filtroFrequencia === 'amarelo' ? 'white' : '#ff9800',
                            '&:hover': { 
                              backgroundColor: filtroFrequencia === 'amarelo' ? '#f57c00' : '#fff8e1',
                              borderColor: '#ff9800'
                            },
                            boxShadow: filtroFrequencia === 'amarelo' ? 2 : 0,
                          }}
                        >
                          🟡 AMARELO ({dashboardFrequencia.alunosPorFrequencia?.filter((a) => a.percentualPresenca >= 60 && a.percentualPresenca < 80).length || 0})
                        </Button>
                        
                        <Button 
                          variant={filtroFrequencia === 'vermelho' ? 'contained' : 'outlined'}
                          onClick={() => setFiltroFrequencia('vermelho')}
                          sx={{ 
                            borderRadius: 2,
                            px: 2.5,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            backgroundColor: filtroFrequencia === 'vermelho' ? '#f44336' : 'transparent',
                            borderColor: '#f44336',
                            color: filtroFrequencia === 'vermelho' ? 'white' : '#f44336',
                            '&:hover': { 
                              backgroundColor: filtroFrequencia === 'vermelho' ? '#d32f2f' : '#ffebee',
                              borderColor: '#f44336'
                            },
                            boxShadow: filtroFrequencia === 'vermelho' ? 2 : 0,
                          }}
                        >
                          🔴 VERMELHO ({dashboardFrequencia.alunosPorFrequencia?.filter((a) => a.percentualPresenca < 60).length || 0})
                        </Button>
                        
                        <Button 
                          variant="contained"
                          onClick={() => setTabelaVisivel(!tabelaVisivel)}
                          sx={{ 
                            borderRadius: 2,
                            px: 2.5,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            backgroundColor: '#424242',
                            color: 'white',
                            '&:hover': { 
                              backgroundColor: '#303030'
                            },
                            boxShadow: 2,
                          }}
                        >
                          {tabelaVisivel ? '👁️ OCULTAR' : '👁️ MOSTRAR'}
                        </Button>
                      </Box>
                      
                      {filtroFrequencia === 'vermelho' && dashboardFrequencia.alunosPorFrequencia?.filter((a) => a.percentualPresenca < 60).length > 0 && (
                        <Alert severity="error" sx={{ py: 0.5, px: 2 }}>
                          <strong>⚠️ {dashboardFrequencia.alunosPorFrequencia.filter((a) => a.percentualPresenca < 60).length}</strong> aluno(s) com frequência crítica
                        </Alert>
                      )}
                    </Box>
                    
                    {/* Tabela de Alunos */}
                    {tabelaVisivel && (
                    <TableContainer component={Paper} elevation={2}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ 
                            backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5'
                          }}>
                            <TableCell><strong>Aluno</strong></TableCell>
                            <TableCell align="center"><strong>Total Aulas</strong></TableCell>
                            <TableCell align="center"><strong>Registros</strong></TableCell>
                            <TableCell align="center"><strong>% Frequência</strong></TableCell>
                            <TableCell align="center"><strong>Status</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(() => {
                            // Selecionar dados conforme filtro de cor
                            let dadosExibir = dashboardFrequencia.alunosPorFrequencia || [];
                            
                            // Aplicar filtro por cor
                            if (filtroFrequencia === 'verde') {
                              dadosExibir = dadosExibir.filter((a) => a.percentualPresenca >= 80);
                            } else if (filtroFrequencia === 'amarelo') {
                              dadosExibir = dadosExibir.filter((a) => a.percentualPresenca >= 60 && a.percentualPresenca < 80);
                            } else if (filtroFrequencia === 'vermelho') {
                              dadosExibir = dadosExibir.filter((a) => a.percentualPresenca < 60);
                            }
                            // Se 'todos', mostra todos os dados
                            
                            // Ordenar por percentual (críticos primeiro)
                            const dadosOrdenados = [...dadosExibir].sort((a, b) => a.percentualPresenca - b.percentualPresenca);
                            
                            if (dadosOrdenados.length === 0) {
                              const mensagens = {
                                'todos': 'Nenhum aluno encontrado',
                                'verde': '✅ Nenhum aluno com frequência boa (80-100%)',
                                'amarelo': '⚠️ Nenhum aluno com frequência de atenção (60-79.99%)',
                                'vermelho': '🎉 Nenhum aluno com frequência crítica (<60%)'
                              };
                              return (
                                <TableRow>
                                  <TableCell colSpan={5} align="center">
                                    <Alert severity={filtroFrequencia === 'vermelho' ? 'success' : 'info'} sx={{ mt: 2 }}>
                                      {mensagens[filtroFrequencia]}
                                    </Alert>
                                  </TableCell>
                                </TableRow>
                              );
                            }
                            
                            return dadosOrdenados.map((aluno) => {
                              const percentual = aluno.percentualPresenca;
                              
                              // Definir cor e label do status
                              let statusColor = 'success';
                              let statusLabel = 'Boa';
                              let statusBg = '#e8f5e9';
                              let statusBgDark = '#1b5e20'; // Verde escuro
                              
                              if (percentual < 60) {
                                statusColor = 'error';
                                statusLabel = 'Crítica';
                                statusBg = '#ffebee';
                                statusBgDark = '#b71c1c'; // Vermelho escuro
                              } else if (percentual < 80) {
                                statusColor = 'warning';
                                statusLabel = 'Atenção';
                                statusBg = '#fff8e1';
                                statusBgDark = '#e65100'; // Laranja escuro
                              }
                              
                              return (
                                <TableRow 
                                  key={aluno.aluno._id} 
                                  sx={{ 
                                    backgroundColor: theme.palette.mode === 'dark' ? statusBgDark : statusBg,
                                    '&:hover': { 
                                      backgroundColor: theme.palette.mode === 'dark' 
                                        ? (statusColor === 'error' ? '#c62828' : statusColor === 'warning' ? '#ef6c00' : '#2e7d32')
                                        : (statusColor === 'error' ? '#ffcdd2' : statusColor === 'warning' ? '#ffecb3' : '#c8e6c9')
                                    }
                                  }}
                                >
                                  <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      {aluno.aluno.nome}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      Mat: {aluno.aluno.matricula}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      {aluno.total}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                                      <Tooltip title="Presenças" arrow>
                                        <Badge 
                                          badgeContent={aluno.presentes} 
                                          color="success"
                                          sx={{
                                            '& .MuiBadge-badge': {
                                              backgroundColor: '#4caf50',
                                              color: 'white',
                                              fontWeight: 700,
                                              fontSize: '0.75rem',
                                              minWidth: '22px',
                                              height: '22px',
                                              borderRadius: '11px'
                                            }
                                          }}
                                        >
                                          <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 28 }} />
                                        </Badge>
                                      </Tooltip>
                                      
                                      <Tooltip title="Faltas" arrow>
                                        <Badge 
                                          badgeContent={aluno.faltas} 
                                          color="error"
                                          sx={{
                                            '& .MuiBadge-badge': {
                                              backgroundColor: '#f44336',
                                              color: 'white',
                                              fontWeight: 700,
                                              fontSize: '0.75rem',
                                              minWidth: '22px',
                                              height: '22px',
                                              borderRadius: '11px'
                                            }
                                          }}
                                        >
                                          <CancelIcon sx={{ color: '#f44336', fontSize: 28 }} />
                                        </Badge>
                                      </Tooltip>
                                      
                                      <Tooltip title="Faltas Justificadas" arrow>
                                        <Badge 
                                          badgeContent={aluno.justificadas} 
                                          color="warning"
                                          sx={{
                                            '& .MuiBadge-badge': {
                                              backgroundColor: '#ff9800',
                                              color: 'white',
                                              fontWeight: 700,
                                              fontSize: '0.75rem',
                                              minWidth: '22px',
                                              height: '22px',
                                              borderRadius: '11px'
                                            }
                                          }}
                                        >
                                          <EventNoteIcon sx={{ color: '#ff9800', fontSize: 28 }} />
                                        </Badge>
                                      </Tooltip>
                                    </Box>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Chip 
                                      label={`${percentual.toFixed(1)}%`}
                                      color={statusColor}
                                      sx={{ 
                                        fontWeight: 700,
                                        fontSize: '0.875rem',
                                        minWidth: '70px',
                                        backgroundColor: statusColor === 'error' ? '#f44336' : statusColor === 'warning' ? '#ff9800' : '#4caf50',
                                        color: 'white'
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <Chip 
                                      label={statusLabel} 
                                      color={statusColor} 
                                      size="small"
                                      variant="outlined"
                                      sx={{ fontWeight: 600 }}
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            });
                          })()}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    )}
                  </Box>
                )}
                
                {(!dashboardFrequencia || (!dashboardFrequencia.alunosCriticos?.length && !dashboardFrequencia.alunosPorFrequencia?.length)) && (
                  <Alert severity="info" sx={{ mt: 3 }}>
                    📊 Nenhum dado de frequência disponível para o período selecionado
                  </Alert>
                )}
              </Paper>
              </Fade>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;
