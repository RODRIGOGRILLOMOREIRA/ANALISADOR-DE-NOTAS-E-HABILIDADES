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
  Divider,
  LinearProgress,
  Fade,
  Zoom,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Assessment,
  Refresh,
  Save,
  Cancel,
  School,
  Upload,
  Download,
} from '@mui/icons-material';
import { avaliacaoService, turmaService, disciplinaService, alunoService } from '../services';
import { toast } from 'react-toastify';
import PageHeader from '../components/PageHeader';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

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

const NIVEIS_HABILIDADE = [
  { value: 'nao-desenvolvido', label: 'Não Desenvolvido', color: 'error' },
  { value: 'em-desenvolvimento', label: 'Em Desenvolvimento', color: 'warning' },
  { value: 'desenvolvido', label: 'Desenvolvido', color: 'info' },
  { value: 'plenamente-desenvolvido', label: 'Plenamente Desenvolvido', color: 'success' },
];

const Avaliacoes = () => {
  const [turmas, setTurmas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [todasAvaliacoes, setTodasAvaliacoes] = useState([]); // Todas as avaliações do ano para cálculo da média anual
  const [habilidadesDisponiveis, setHabilidadesDisponiveis] = useState([]);
  
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
    { tipo: 'prova', descricao: '', nota: '', peso: 1, habilidades: [] }
  ]);

  // Auto-refresh
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(false);

  // Importação
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [importData, setImportData] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [turmaSelecionadaTemplate, setTurmaSelecionadaTemplate] = useState('');
  const [disciplinaSelecionadaTemplate, setDisciplinaSelecionadaTemplate] = useState('');
  const [habilidadesTemplate, setHabilidadesTemplate] = useState([]);

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

  const loadHabilidadesDisponiveis = async () => {
    try {
      const response = await fetch(
        `/api/avaliacoes/habilidades-disponiveis?disciplina=${filtros.disciplina}&turma=${filtros.turma}&ano=${filtros.ano}&trimestre=${filtros.trimestre}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setHabilidadesDisponiveis(data);
      }
    } catch (error) {
      console.error('Erro ao carregar habilidades:', error);
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

  const handleOpenDialog = async (aluno) => {
    setAlunoSelecionado(aluno);
    
    // Carregar habilidades disponíveis
    await loadHabilidadesDisponiveis();
    
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
        habilidades: av.habilidades || [],
      })));
    } else {
      setAvaliacaoAtual(null);
      setNovasAvaliacoes([{ tipo: 'prova', descricao: '', nota: '', peso: 1, habilidades: [] }]);
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAlunoSelecionado(null);
    setAvaliacaoAtual(null);
    setNovasAvaliacoes([{ tipo: 'prova', descricao: '', nota: '', peso: 1, habilidades: [] }]);
    setHabilidadesDisponiveis([]);
  };

  const handleAddAvaliacao = () => {
    setNovasAvaliacoes([...novasAvaliacoes, { tipo: 'prova', descricao: '', nota: '', peso: 1, habilidades: [] }]);
  };

  const handleRemoveAvaliacao = (index) => {
    const updated = novasAvaliacoes.filter((_, i) => i !== index);
    setNovasAvaliacoes(updated.length > 0 ? updated : [{ tipo: 'prova', descricao: '', nota: '', peso: 1, habilidades: [] }]);
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
          habilidades: (av.habilidades || [])
            .filter(h => h.habilidade) // Apenas habilidades selecionadas
            .map(h => ({
              habilidade: h.habilidade,
              nivel: h.nivel,
              observacao: h.observacao || ''
            }))
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

  // Funções para manipular habilidades
  const handleAddHabilidade = (avaliacaoIndex) => {
    const updated = [...novasAvaliacoes];
    if (!updated[avaliacaoIndex].habilidades) {
      updated[avaliacaoIndex].habilidades = [];
    }
    updated[avaliacaoIndex].habilidades.push({
      habilidade: '',
      nivel: 'em-desenvolvimento',
      observacao: ''
    });
    setNovasAvaliacoes(updated);
  };

  const handleRemoveHabilidade = (avaliacaoIndex, habilidadeIndex) => {
    const updated = [...novasAvaliacoes];
    updated[avaliacaoIndex].habilidades.splice(habilidadeIndex, 1);
    setNovasAvaliacoes(updated);
  };

  const handleHabilidadeChange = (avaliacaoIndex, habilidadeIndex, field, value) => {
    const updated = [...novasAvaliacoes];
    updated[avaliacaoIndex].habilidades[habilidadeIndex][field] = value;
    setNovasAvaliacoes(updated);
  };

  // Funções de importação
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          
          const validData = jsonData.filter(row => 
            (row.matricula_aluno || row.aluno_nome) && 
            (row.codigo_disciplina || row.disciplina_nome) &&
            row.turma_nome && row.nota
          );
          setImportData(validData);
          if (validData.length > 0) {
            toast.success(`${validData.length} avaliações encontradas no arquivo Excel`);
          } else {
            toast.error('Nenhuma avaliação válida encontrada no arquivo');
          }
        } catch (error) {
          toast.error('Erro ao ler arquivo Excel: ' + error.message);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const validData = results.data.filter(row => 
            (row.matricula_aluno || row.aluno_nome) && 
            (row.codigo_disciplina || row.disciplina_nome) &&
            row.turma_nome && row.nota
          );
          setImportData(validData);
          if (validData.length > 0) {
            toast.success(`${validData.length} avaliações encontradas no arquivo CSV`);
          } else {
            toast.error('Nenhuma avaliação válida encontrada no arquivo');
          }
        },
        error: (error) => {
          toast.error('Erro ao ler arquivo CSV: ' + error.message);
        }
      });
    }
  };

  const handleImport = async () => {
    if (importData.length === 0) {
      toast.error('Nenhuma avaliação para importar');
      return;
    }

    try {
      setLoading(true);
      const response = await avaliacaoService.importar(importData);
      
      toast.success(`${response.sucesso} avaliações importadas com sucesso!`);
      if (response.erros > 0) {
        toast.warning(`${response.erros} avaliações com erro. Verifique os dados.`);
        console.log('Detalhes dos erros:', response.detalhes);
      }
      
      setOpenImportDialog(false);
      setImportData([]);
      loadAvaliacoes();
    } catch (error) {
      toast.error('Erro ao importar avaliações: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async (format = 'csv') => {
    try {
      // Se turma e disciplina estiverem selecionadas, busca template real da turma
      if (turmaSelecionadaTemplate && disciplinaSelecionadaTemplate) {
        setLoading(true);
        const data = await avaliacaoService.getTemplatePorTurma(turmaSelecionadaTemplate, {
          disciplinaId: disciplinaSelecionadaTemplate,
          trimestre: filtros.trimestre,
          ano: filtros.ano
        });
        
        // Armazenar habilidades disponíveis para exibir
        setHabilidadesTemplate(data.habilidadesDisponiveis || []);
        
        if (format === 'excel') {
          const ws = XLSX.utils.json_to_sheet(data.template);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Avaliações');
          XLSX.writeFile(wb, `template_avaliacoes_${data.turma.nome}_${data.disciplina.nome}.xlsx`);
        } else {
          const csv = Papa.unparse(data.template);
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `template_avaliacoes_${data.turma.nome}_${data.disciplina.nome}.csv`;
          link.click();
        }
        
        toast.success(`Template de ${data.turma.nome} - ${data.disciplina.nome} baixado com ${data.turma.totalAlunos} alunos`);
        setLoading(false);
      } else {
        // Template genérico de exemplo
        const templateExemplo = [
          {
            matricula_aluno: '2026001',
            aluno_nome: 'João Silva',
            codigo_disciplina: 'MAT',
            disciplina_nome: 'Matemática',
            turma_nome: '1º Ano A',
            professor_nome: 'Prof. Carlos',
            ano: 2026,
            trimestre: 1,
            tipo_avaliacao: 'prova',
            descricao: 'Prova Bimestral',
            nota: 8.5,
            peso: 3,
            data_avaliacao: '2026-03-15',
            habilidades_codigos: 'EF06MA01,EF06MA02',
            observacoes: ''
          },
          {
            matricula_aluno: '2026002',
            aluno_nome: 'Ana Santos',
            codigo_disciplina: 'POR',
            disciplina_nome: 'Português',
            turma_nome: '2º Ano B',
            professor_nome: 'Prof. Maria',
            ano: 2026,
            trimestre: 1,
            tipo_avaliacao: 'trabalho',
            descricao: 'Trabalho em Grupo',
            nota: 9.0,
            peso: 2,
            data_avaliacao: '2026-03-20',
            habilidades_codigos: 'EF06LP01;EF06LP02',
            observacoes: 'Excelente apresentação'
          }
        ];
        
        if (format === 'excel') {
          const ws = XLSX.utils.json_to_sheet(templateExemplo);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Avaliações');
          XLSX.writeFile(wb, 'template_avaliacoes_exemplo.xlsx');
        } else {
          const csv = Papa.unparse(templateExemplo);
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'template_avaliacoes_exemplo.csv';
          link.click();
        }
        
        toast.info('Selecione uma turma e disciplina para baixar template específico');
      }
    } catch (error) {
      toast.error('Erro ao gerar template: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <PageHeader 
        title="Avaliações"
        subtitle="Gerencie e lance notas das avaliações dos alunos"
        icon={Assessment}
      />
      
      <Zoom in={true} timeout={400}>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mb: 3 }}>
          <Tooltip title="Importar avaliações em lote">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Upload />}
              onClick={() => setOpenImportDialog(true)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Importar
            </Button>
          </Tooltip>
          <Tooltip title={autoRefresh ? 'Atualização automática ativa' : 'Atualização automática desativada'}>
            <Button
              variant={autoRefresh ? 'contained' : 'outlined'}
              color={autoRefresh ? 'success' : 'default'}
              onClick={() => setAutoRefresh(!autoRefresh)}
              startIcon={<Refresh />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Auto {autoRefresh ? 'ON' : 'OFF'}
            </Button>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadAvaliacoes}
            disabled={!filtros.turma || !filtros.disciplina}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
              }
            }}
          >
            Atualizar
          </Button>
        </Box>
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
      </Fade>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Lista de Alunos */}
      {filtros.turma && filtros.disciplina && alunos.length > 0 && (
        <Fade in={true} timeout={800}>
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
                <TableCell sx={{ fontWeight: 700 }}>Matrícula</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Nome do Aluno</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Avaliações</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Nota Trimestral</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Média Anual</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alunos.map((aluno) => {
                const avaliacaoAluno = avaliacoes.find(av => av.aluno._id === aluno._id);
                const mediaAnual = getMediaAnualAluno(aluno._id);
                
                return (
                  <TableRow 
                    key={aluno._id} 
                    hover
                    sx={{
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: (theme) => theme.palette.mode === 'dark' 
                          ? 'rgba(0, 188, 212, 0.08)' 
                          : 'rgba(102, 126, 234, 0.05)',
                        transform: 'scale(1.005)',
                      }
                    }}
                  >
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
        </Fade>
      )}

      {filtros.turma && filtros.disciplina && alunos.length === 0 && !loading && (
        <Fade in={true} timeout={800}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Typography color="text.secondary">
              Nenhum aluno encontrado nesta turma.
            </Typography>
          </Paper>
        </Fade>
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

                {/* Seção de Habilidades */}
                <Divider sx={{ my: 2 }}>
                  <Chip icon={<School />} label="Habilidades" size="small" />
                </Divider>

                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Add />}
                    onClick={() => handleAddHabilidade(index)}
                    fullWidth
                    disabled={habilidadesDisponiveis.length === 0}
                  >
                    Adicionar Habilidade
                  </Button>
                  {habilidadesDisponiveis.length === 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                      Nenhuma habilidade cadastrada para este trimestre
                    </Typography>
                  )}
                </Box>

                {avaliacao.habilidades && avaliacao.habilidades.map((hab, habIndex) => (
                  <Card key={habIndex} variant="outlined" sx={{ mb: 1, bgcolor: 'background.default' }}>
                    <CardContent sx={{ py: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Habilidade #{habIndex + 1}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveHabilidade(index, habIndex)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          <TextField
                            select
                            fullWidth
                            size="small"
                            label="Habilidade"
                            value={hab.habilidade}
                            onChange={(e) => handleHabilidadeChange(index, habIndex, 'habilidade', e.target.value)}
                          >
                            <MenuItem value="">Selecione...</MenuItem>
                            {habilidadesDisponiveis.map((habilidade) => (
                              <MenuItem key={habilidade._id} value={habilidade._id}>
                                {habilidade.codigo} - {habilidade.descricao}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            select
                            fullWidth
                            size="small"
                            label="Nível de Desenvolvimento"
                            value={hab.nivel}
                            onChange={(e) => handleHabilidadeChange(index, habIndex, 'nivel', e.target.value)}
                          >
                            {NIVEIS_HABILIDADE.map((nivel) => (
                              <MenuItem key={nivel.value} value={nivel.value}>
                                {nivel.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Observação"
                            value={hab.observacao || ''}
                            onChange={(e) => handleHabilidadeChange(index, habIndex, 'observacao', e.target.value)}
                            placeholder="Observação (opcional)"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          ))}

          <Divider sx={{ my: 2 }} />

          <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Nota Trimestral Calculada
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#4169E1' }}>
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

      {/* Diálogo de Importação */}
      <Dialog 
        open={openImportDialog} 
        onClose={() => setOpenImportDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Upload color="primary" />
            <Typography variant="h6">Importar Avaliações</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
            <Tab label="Upload" />
            <Tab label="Instruções" />
          </Tabs>

          {tabValue === 0 && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                Faça upload de um arquivo CSV ou Excel (.xlsx) com as avaliações.
                Campos obrigatórios: matricula_aluno ou aluno_nome, codigo_disciplina ou disciplina_nome, turma_nome, nota.
              </Alert>

              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                📥 Baixar Template Personalizado por Turma
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Selecione a Turma"
                    value={turmaSelecionadaTemplate}
                    onChange={(e) => setTurmaSelecionadaTemplate(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Selecione uma turma</em>
                    </MenuItem>
                    {turmas.map((turma) => (
                      <MenuItem key={turma._id} value={turma._id}>
                        {turma.nome} ({turma.serie})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Selecione a Disciplina"
                    value={disciplinaSelecionadaTemplate}
                    onChange={(e) => setDisciplinaSelecionadaTemplate(e.target.value)}
                    disabled={!turmaSelecionadaTemplate}
                  >
                    <MenuItem value="">
                      <em>Selecione uma disciplina</em>
                    </MenuItem>
                    {disciplinas.map((disciplina) => (
                      <MenuItem key={disciplina._id} value={disciplina._id}>
                        {disciplina.codigo} - {disciplina.nome}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              {turmaSelecionadaTemplate && disciplinaSelecionadaTemplate && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  O template será gerado com todos os alunos da turma selecionada!
                </Alert>
              )}

              {habilidadesTemplate.length > 0 && (
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'info.lighter' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                    🎯 Habilidades Disponíveis para esta Disciplina:
                  </Typography>
                  <Box sx={{ maxHeight: 150, overflow: 'auto' }}>
                    {habilidadesTemplate.map((hab, index) => (
                      <Chip
                        key={index}
                        label={`${hab.codigo}: ${hab.descricao}`}
                        size="small"
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </Box>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Use estes códigos na coluna "habilidades_codigos" separados por vírgula ou ponto e vírgula
                  </Typography>
                </Paper>
              )}

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => downloadTemplate('csv')}
                  fullWidth
                >
                  Baixar Template CSV
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => downloadTemplate('excel')}
                  fullWidth
                >
                  Baixar Template Excel
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Button
                variant="contained"
                component="label"
                fullWidth
                startIcon={<Upload />}
                sx={{ mb: 3 }}
              >
                Selecionar Arquivo
                <input
                  type="file"
                  hidden
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                />
              </Button>

              {importData.length > 0 && (
                <Box>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {importData.length} avaliações prontas para importar
                  </Alert>
                  <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
                    <List dense>
                      {importData.slice(0, 10).map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`${item.aluno_nome || item.matricula_aluno} - ${item.disciplina_nome || item.codigo_disciplina}`}
                            secondary={`Nota: ${item.nota} | Turma: ${item.turma_nome} | ${item.tipo_avaliacao || 'prova'} ${item.habilidades_codigos ? '| 🎯 ' + item.habilidades_codigos : ''}`}
                          />
                        </ListItem>
                      ))}
                      {importData.length > 10 && (
                        <ListItem>
                          <ListItemText secondary={`... e mais ${importData.length - 10} avaliações`} />
                        </ListItem>
                      )}
                    </List>
                  </Paper>
                </Box>
              )}
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                📋 Formato do Arquivo
              </Typography>
              <Typography variant="body2" paragraph>
                O arquivo deve conter as seguintes colunas:
              </Typography>
              <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2" component="div" sx={{ fontFamily: 'monospace' }}>
                  <strong>Obrigatórios:</strong><br />
                  • matricula_aluno ou aluno_nome<br />
                  • codigo_disciplina ou disciplina_nome<br />
                  • turma_nome<br />
                  • nota (0 a 10)<br />
                  <br />
                  <strong>Opcionais:</strong><br />
                  • professor_nome<br />
                  • ano (padrão: ano atual)<br />
                  • trimestre (1, 2 ou 3 - padrão: 1)<br />
                  • tipo_avaliacao (prova, trabalho, participacao, etc.)<br />
                  • descricao<br />
                  • peso (padrão: 1)<br />
                  • data_avaliacao (formato: AAAA-MM-DD)<br />
                  • <strong>habilidades_codigos</strong> 🆕 (códigos separados por vírgula ou ponto e vírgula) <br />
                  • observacoes
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 2, mb: 2, bgcolor: 'success.lighter' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  🎯 Como Preencher a Coluna de Habilidades:
                </Typography>
                <Typography variant="body2" component="div">
                  A coluna <strong>habilidades_codigos</strong> permite vincular habilidades BNCC à avaliação.<br /><br />
                  
                  <strong>Formato aceito:</strong><br />
                  • Códigos separados por <strong>vírgula</strong>: EF06MA01,EF06MA02,EF06MA03<br />
                  • Códigos separados por <strong>ponto e vírgula</strong>: EF06MA01;EF06MA02;EF06MA03<br />
                  • Também aceita com espaços: EF06MA01, EF06MA02, EF06MA03<br />
                  <br />
                  
                  <strong>Exemplos práticos:</strong><br />
                  • Matemática: EF06MA01,EF06MA02<br />
                  • Português: EF06LP01;EF06LP02;EF06LP03<br />
                  • História: EF06HI01,EF06HI02<br />
                  <br />
                  
                  <strong>IMPORTANTE:</strong><br />
                  • Os códigos devem corresponder a habilidades já cadastradas no sistema<br />
                  • Use o botão "Baixar Template" selecionando turma e disciplina para ver as habilidades disponíveis<br />
                  • Habilidades não encontradas serão ignoradas sem gerar erro<br />
                  • Deixe a coluna vazia se não quiser vincular habilidades
                </Typography>
              </Paper>
              
              <Alert severity="warning">
                <Typography variant="body2">
                  <strong>Importante:</strong> O sistema buscará alunos pela matrícula ou nome,
                  disciplinas pelo código ou nome, e turmas pelo nome. Certifique-se de que
                  os dados correspondem aos cadastrados no sistema.
                </Typography>
              </Alert>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Dica:</strong> Selecione uma turma e disciplina específicas na aba "Upload" 
                  e baixe o template personalizado. Ele virá com todos os alunos da turma e a lista 
                  de habilidades disponíveis para aquela disciplina.
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenImportDialog(false);
            setImportData([]);
            setTabValue(0);
          }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleImport}
            disabled={importData.length === 0 || loading}
            startIcon={<Upload />}
          >
            {loading ? 'Importando...' : 'Importar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Avaliacoes;
