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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
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
  Upload,
  Download,
  ArrowForward,
  ArrowBack,
 Today,
} from '@mui/icons-material';
import { frequenciaService, turmaService, disciplinaService, alunoService } from '../services';
import { toast } from 'react-toastify';
import PageHeader from '../components/PageHeader';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

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
  const [chamadaIniciada, setChamadaIniciada] = useState(false); // Controla se iniciou o lançamento

  // Dialog de justificativa
  const [dialogJustificativa, setDialogJustificativa] = useState(false);
  const [alunoJustificar, setAlunoJustificar] = useState(null);
  const [justificativa, setJustificativa] = useState('');

  // Importação
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [importData, setImportData] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  
  // Template personalizado por turma
  const [turmaSelecionadaTemplate, setTurmaSelecionadaTemplate] = useState('');
  const [disciplinaSelecionadaTemplate, setDisciplinaSelecionadaTemplate] = useState('');

  // Estatísticas
  const [stats, setStats] = useState({
    total: 0,
    presentes: 0,
    faltas: 0,
    justificadas: 0,
    percentual: 100,
  });

  useEffect(() => {
    loadTurmas();
    loadDisciplinas();
  }, []);

  useEffect(() => {
    const carregarDados = async () => {
      if (filtros.turma && filtros.disciplina && filtros.data) {
        // IMPORTANTE: Carregar alunos PRIMEIRO, depois frequência
        await loadAlunos();
        await loadFrequencia();
      }
    };
    carregarDados();
  }, [filtros.turma, filtros.disciplina, filtros.data]);

  useEffect(() => {
    // Só calcular stats se temos alunos
    if (alunos.length > 0) {
      calcularStats();
    }
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
      console.log('🔄 Carregando frequência para:', { 
        turma: filtros.turma, 
        data: filtros.data, 
        disciplina: filtros.disciplina,
        totalAlunos: alunos.length
      });
      
      const response = await frequenciaService.getFrequenciaTurmaDia(
        filtros.turma,
        filtros.data,
        { disciplina: filtros.disciplina }
      );
      
      console.log('✅ Resposta do servidor:', {
        totalFrequencias: response.frequencias?.length || 0,
        frequencias: response.frequencias
      });
      
      // Se existem frequências salvas, carregar os dados salvos
      if (response.frequencias && response.frequencias.length > 0) {
        const presencasCarregadas = {};
        const frequenciasObj = {};
        
        response.frequencias.forEach(freq => {
          const alunoId = freq.aluno._id || freq.aluno;
          presencasCarregadas[alunoId] = freq.status;
          frequenciasObj[alunoId] = freq;
        });
        
        console.log('✅ Frequências salvas carregadas:', {
          total: response.frequencias.length,
          presente: Object.values(presencasCarregadas).filter(p => p === 'presente').length,
          falta: Object.values(presencasCarregadas).filter(p => p === 'falta').length,
          justificada: Object.values(presencasCarregadas).filter(p => p === 'falta-justificada').length
        });
        
        setPresencas(presencasCarregadas);
        setFrequencias(frequenciasObj);
        setChamadaIniciada(true); // Marca como iniciada pois tem dados salvos
      } else {
        // Sem frequências salvas - limpar estado
        console.log('📄 Nenhuma frequência salva para esta data');
        setPresencas({});
        setFrequencias({});
        setChamadaIniciada(false); // Não foi iniciada
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar frequência:', error);
      // Em caso de erro, limpar estado
      setPresencas({});
      setFrequencias({});
      setChamadaIniciada(false);
    } finally {
      setLoading(false);
    }
  };

  const calcularStats = () => {
    // Se a chamada não foi iniciada, não calcular stats
    if (!chamadaIniciada || alunos.length === 0) {
      console.log('⚠️ Aguardando início da chamada ou carregamento de alunos...');
      setStats({
        total: alunos.length,
        presentes: 0,
        faltas: 0,
        justificadas: 0,
        percentual: 0
      });
      return;
    }
    
    console.log('🔢 Calculando stats:', {
      totalAlunos: alunos.length,
      totalPresencas: Object.keys(presencas).length,
      detalhes: Object.values(presencas).reduce((acc, status) => {
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {})
    });
    
    const total = alunos.length;
    const presentes = Object.values(presencas).filter(p => p === 'presente').length;
    const faltas = Object.values(presencas).filter(p => p === 'falta').length;
    const justificadas = Object.values(presencas).filter(p => p === 'falta-justificada').length;
    const percentual = total > 0 ? ((presentes / total) * 100).toFixed(1) : 0;

    console.log('✅ Stats atualizados:', { total, presentes, faltas, justificadas, percentual: percentual + '%' });
    setStats({ total, presentes, faltas, justificadas, percentual });
  };

  const handleIniciarChamada = () => {
    // Inicializar todos os alunos como 'presente'
    const presencasIniciais = {};
    alunos.forEach(aluno => {
      presencasIniciais[aluno._id] = 'presente';
    });
    
    console.log('🆕 Iniciando nova chamada:', {
      totalAlunos: alunos.length,
      data: filtros.data,
      disciplina: filtros.disciplina
    });
    
    setPresencas(presencasIniciais);
    setChamadaIniciada(true);
    toast.info('Chamada iniciada! Todos os alunos marcados como presentes. Faça os ajustes necessários.');
  };

  const handlePresencaChange = async (alunoId, status) => {
    // Atualizar localmente primeiro (feedback imediato)
    setPresencas(prev => ({
      ...prev,
      [alunoId]: status
    }));
    
    // Não atualizar no servidor em tempo real - apenas ao clicar em "Salvar Chamada"
    // Isso evita resetar a chamada durante a edição
    console.log(`✏️ Presença alterada localmente:`, {
      alunoId,
      novoStatus: status,
      observacao: 'Será salvo ao clicar em "Salvar Chamada"'
    });
  };

  const handleSalvarChamada = async () => {
    try {
      setSalvando(true);
      
      if (!filtros.turma || !filtros.disciplina || !filtros.data) {
        toast.error('Selecione turma, disciplina e data antes de salvar');
        setSalvando(false);
        return;
      }
      
      if (Object.keys(presencas).length === 0) {
        toast.error('Marque a presença dos alunos antes de salvar');
        setSalvando(false);
        return;
      }
      
      const turma = turmas.find(t => t._id === filtros.turma);
      
      console.log('📋 Turma selecionada:', turma);
      console.log('📚 Disciplinas da turma:', turma?.disciplinas);
      
      // Buscar professor da disciplina na turma
      let professor = null;
      if (turma && turma.disciplinas && Array.isArray(turma.disciplinas)) {
        const discTurma = turma.disciplinas.find(d => {
          const discId = d.disciplina?._id || d.disciplina;
          return discId === filtros.disciplina || String(discId) === String(filtros.disciplina);
        });
        
        if (discTurma) {
          professor = discTurma.professor?._id || discTurma.professor || null;
          console.log('👨‍🏫 Professor encontrado:', professor);
        } else {
          console.warn('⚠️ Disciplina não encontrada na turma');
        }
      }
      
      const payload = {
        data: filtros.data,
        disciplina: filtros.disciplina,
        professor: professor,
        periodo: turma?.turno || 'matutino',
        presencas
      };
      
      console.log('📝 Salvando frequência:', {
        turmaId: filtros.turma,
        turmaNome: turma?.nome,
        data: filtros.data,
        disciplinaId: filtros.disciplina,
        professorId: professor,
        totalAlunos: Object.keys(presencas).length,
        payload
      });
      
      const response = await frequenciaService.registrarChamadaTurma(filtros.turma, payload);
      
      console.log('✅ Resposta do servidor:', response);
      
      // Atualizar frequências salvas no estado
      const frequenciasObj = {};
      response.frequencias?.forEach(freq => {
        const alunoId = freq.aluno._id || freq.aluno;
        frequenciasObj[alunoId] = freq;
      });
      setFrequencias(frequenciasObj);
      
      // Forçar recálculo imediato dos stats com os dados salvos
      const total = alunos.length;
      const presentes = Object.values(presencas).filter(p => p === 'presente').length;
      const faltas = Object.values(presencas).filter(p => p === 'falta').length;
      const justificadas = Object.values(presencas).filter(p => p === 'falta-justificada').length;
      const percentual = total > 0 ? ((presentes / total) * 100).toFixed(1) : 100;
      
      setStats({ total, presentes, faltas, justificadas, percentual });
      
      console.log('✅ Stats atualizados após salvamento:', { total, presentes, faltas, justificadas, percentual });
      
      toast.success(`✅ Frequência salva com sucesso! ${response.total || 0} registro(s) processado(s).`);
    } catch (error) {
      console.error('❌ Erro ao salvar frequência:', error);
      console.error('Detalhes do erro:', error.response?.data);
      toast.error('❌ Erro ao salvar: ' + (error.response?.data?.message || error.message));
    } finally {
      setSalvando(false);
    }
  };

  const handleJustificarFalta = async () => {
    try {
      if (!justificativa.trim()) {
        toast.error('Digite a justificativa');
        return;
      }
      
      // Atualizar estado local para marcar como falta-justificada
      setPresencas(prev => ({
        ...prev,
        [alunoJustificar]: 'falta-justificada'
      }));
      
      // Se já existe frequência salva, atualizar no servidor
      const freq = frequencias[alunoJustificar];
      if (freq) {
        try {
          await frequenciaService.justificarFalta(freq._id, {
            descricao: justificativa
          });
          console.log('✅ Justificativa salva no servidor');
        } catch (error) {
          console.warn('⚠️ Erro ao salvar justificativa no servidor:', error);
          // Continua mesmo se falhar - será salva quando clicar em "Salvar Chamada"
        }
      }
      
      toast.success('Falta justificada! Lembre-se de salvar a chamada.');
      setDialogJustificativa(false);
      setJustificativa('');
      setAlunoJustificar(null);
      
      // NÃO recarregar - mantém o estado atual da chamada
      // loadFrequencia(); ← REMOVIDO
    } catch (error) {
      console.error('Erro ao justificar falta:', error);
      toast.error('Erro ao justificar falta');
    }
  };

  const getFrequenciaStatus = (percentual) => {
    if (percentual >= FREQUENCIA_STATUS.bom.min) return FREQUENCIA_STATUS.bom;
    if (percentual >= FREQUENCIA_STATUS.atencao.min) return FREQUENCIA_STATUS.atencao;
    return FREQUENCIA_STATUS.critico;
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
            row.turma_nome && row.data
          );
          setImportData(validData);
          if (validData.length > 0) {
            toast.success(`${validData.length} frequências encontradas no arquivo Excel`);
          } else {
            toast.error('Nenhuma frequência válida encontrada no arquivo');
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
            row.turma_nome && row.data
          );
          setImportData(validData);
          if (validData.length > 0) {
            toast.success(`${validData.length} frequências encontradas no arquivo CSV`);
          } else {
            toast.error('Nenhuma frequência válida encontrada no arquivo');
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
      toast.error('Nenhuma frequência para importar');
      return;
    }

    try {
      setLoading(true);
      const response = await frequenciaService.importar(importData);
      
      toast.success(`${response.criados} frequências criadas, ${response.atualizados} atualizadas!`);
      if (response.erros > 0) {
        toast.warning(`${response.erros} registros com erro. Verifique os dados.`);
        console.log('Detalhes dos erros:', response.detalhes);
      }
      
      setOpenImportDialog(false);
      setImportData([]);
      loadFrequencia();
    } catch (error) {
      toast.error('Erro ao importar frequências: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async (format = 'csv') => {
    try {
      // Se há turma selecionada, baixar template personalizado
      if (turmaSelecionadaTemplate) {
        const params = {};
        if (disciplinaSelecionadaTemplate) {
          params.disciplinaId = disciplinaSelecionadaTemplate;
        }
        if (filtros.data) {
          params.data = filtros.data;
        }

        const response = await frequenciaService.getTemplatePorTurma(turmaSelecionadaTemplate, params);
        const { turma, disciplina, template, instrucoes, codigos_status } = response;

        if (format === 'excel') {
          const ws = XLSX.utils.json_to_sheet(template);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Frequências');
          
          // Adicionar instruções em outra aba
          const wsInstrucoes = XLSX.utils.aoa_to_sheet([
            ['INSTRUÇÕES PARA PREENCHIMENTO DE FREQUÊNCIAS'],
            [''],
            ['CÓDIGOS DE STATUS RÁPIDOS (coluna status_codigo):'],
            ['P = Presente'],
            ['F = Falta'],
            ['FJ = Falta Justificada'],
            ['A = Atestado'],
            ['VAZIO = Presente (padrão)'],
            [''],
            ['INSTRUÇÕES:'],
            [instrucoes.status],
            [instrucoes.status_codigo],
            [instrucoes.dica],
            [''],
            ['IMPORTANTE:'],
            ['- Não altere as colunas matricula_aluno, aluno_nome, turma_nome'],
            ['- Não remova cabeçalhos'],
            ['- Use a coluna status_codigo (P, F, FJ, A) para rapidez'],
            ['- Ou use a coluna status (presente, falta, falta-justificada, atestado)'],
            ['- Se ambas estiverem vazias, será considerado "presente"'],
          ]);
          XLSX.utils.book_append_sheet(wb, wsInstrucoes, 'Instruções');
          
          const fileName = disciplina 
            ? `frequencia_${turma.nome}_${disciplina.nome}.xlsx`
            : `frequencia_${turma.nome}_todas_disciplinas.xlsx`;
          XLSX.writeFile(wb, fileName);
        } else {
          const csv = Papa.unparse(template);
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          const fileName = disciplina 
            ? `frequencia_${turma.nome}_${disciplina.nome}.csv`
            : `frequencia_${turma.nome}_todas_disciplinas.csv`;
          link.download = fileName;
          link.click();
        }

        toast.success('Template personalizado baixado com sucesso!');
        return;
      }

      // Template genérico (comportamento anterior)
      const dataExemplo = new Date().toISOString().split('T')[0];
      
      if (format === 'excel') {
        const ws = XLSX.utils.json_to_sheet([
          {
            matricula_aluno: '2026001',
            aluno_nome: 'João Silva',
            codigo_disciplina: 'MAT',
            disciplina_nome: 'Matemática',
            turma_nome: '1º Ano A',
            data: dataExemplo,
            status: '',
            status_codigo: 'P',
            periodo: 'matutino',
            observacao: ''
          },
          {
            matricula_aluno: '2026002',
            aluno_nome: 'Ana Santos',
            codigo_disciplina: 'POR',
            disciplina_nome: 'Português',
            turma_nome: '2º Ano B',
            data: dataExemplo,
            status: '',
            status_codigo: 'F',
            periodo: 'vespertino',
            observacao: 'Aluna avisou'
          },
          {
            matricula_aluno: '2026003',
            aluno_nome: 'Pedro Costa',
            codigo_disciplina: 'MAT',
            disciplina_nome: 'Matemática',
            turma_nome: '3º Ano C',
            data: dataExemplo,
            status: '',
            status_codigo: 'FJ',
            periodo: 'matutino',
            observacao: 'Atestado médico'
          }
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Frequências');
        
        // Adicionar instruções
        const wsInstrucoes = XLSX.utils.aoa_to_sheet([
          ['CÓDIGOS DE STATUS'],
          ['P = Presente'],
          ['F = Falta'],
          ['FJ = Falta Justificada'],
          ['A = Atestado'],
          [''],
          ['Use a coluna status_codigo para mais rapidez!'],
        ]);
        XLSX.utils.book_append_sheet(wb, wsInstrucoes, 'Códigos');
        
        XLSX.writeFile(wb, 'template_frequencias.xlsx');
      } else {
        const csv = 'matricula_aluno,aluno_nome,codigo_disciplina,disciplina_nome,turma_nome,data,status,status_codigo,periodo,observacao\n' +
                    `2026001,João Silva,MAT,Matemática,1º Ano A,${dataExemplo},,P,matutino,\n` +
                    `2026002,Ana Santos,POR,Português,2º Ano B,${dataExemplo},,F,vespertino,Aluna avisou\n` +
                    `2026003,Pedro Costa,MAT,Matemática,3º Ano C,${dataExemplo},,FJ,matutino,Atestado médico`;
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'template_frequencias.csv';
        link.click();
      }
    } catch (error) {
      console.error('Erro ao baixar template:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.detalhes || 
                          error.message || 
                          'Erro desconhecido ao baixar template';
      toast.error(errorMessage);
    }
  };

  const statusGeral = getFrequenciaStatus(parseFloat(stats.percentual));

  return (
    <Container maxWidth="xl">
      <PageHeader 
        title="Frequências"
        subtitle="Registre e acompanhe a presença dos alunos diariamente"
        icon={EventNote}
      />
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Upload />}
            onClick={() => setOpenImportDialog(true)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Importar
          </Button>
        </Box>
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
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Tooltip title="Dia Anterior">
                <IconButton 
                  size="small" 
                  onClick={() => {
                    const dataAtual = new Date(filtros.data + 'T12:00:00');
                    dataAtual.setDate(dataAtual.getDate() - 1);
                    setFiltros({ ...filtros, data: dataAtual.toISOString().split('T')[0] });
                  }}
                >
                  <ArrowBack />
                </IconButton>
              </Tooltip>
              <TextField
                fullWidth
                type="date"
                label="Data da Chamada"
                value={filtros.data}
                onChange={(e) => setFiltros({ ...filtros, data: e.target.value })}
                InputLabelProps={{ shrink: true }}
                helperText="Você pode lançar frequências retroativas"
              />
              <Tooltip title="Próximo Dia">
                <IconButton 
                  size="small"
                  onClick={() => {
                    const dataAtual = new Date(filtros.data + 'T12:00:00');
                    dataAtual.setDate(dataAtual.getDate() + 1);
                    setFiltros({ ...filtros, data: dataAtual.toISOString().split('T')[0] });
                  }}
                >
                  <ArrowForward />
                </IconButton>
              </Tooltip>
              <Tooltip title="Hoje">
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={() => setFiltros({ ...filtros, data: new Date().toISOString().split('T')[0] })}
                >
                  <Today />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
        
        {filtros.data !== new Date().toISOString().split('T')[0] && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Você está lançando frequência para o dia {new Date(filtros.data + 'T12:00:00').toLocaleDateString('pt-BR')}
          </Alert>
        )}
      </Paper>

      {/* Estatísticas */}
      {filtros.turma && filtros.disciplina && alunos.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={2.4}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" align="center" sx={{ color: '#4169E1', fontWeight: 600 }}>{stats.total}</Typography>
                <Typography variant="body2" align="center">Total de Alunos</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={2.4}>
            <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" align="center" sx={{ color: '#4169E1', fontWeight: 600 }}>{stats.presentes}</Typography>
                <Typography variant="body2" align="center">Presentes</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={2.4}>
            <Card sx={{ bgcolor: 'error.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" align="center" sx={{ color: '#4169E1', fontWeight: 600 }}>{stats.faltas}</Typography>
                <Typography variant="body2" align="center">Faltas</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={2.4}>
            <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" align="center" sx={{ color: '#4169E1', fontWeight: 600 }}>{stats.justificadas || 0}</Typography>
                <Typography variant="body2" align="center">Justificadas</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={2.4}>
            <Card sx={{ bgcolor: statusGeral.color + '.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" align="center" sx={{ color: '#4169E1', fontWeight: 600 }}>{stats.percentual}%</Typography>
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
          
          {/* Se não tem frequência salva E não iniciou chamada, mostrar botão para iniciar */}
          {!chamadaIniciada && Object.keys(frequencias).length === 0 && (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Chamada não iniciada para {new Date(filtros.data + 'T12:00:00').toLocaleDateString('pt-BR')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Clique no botão abaixo para iniciar o lançamento de frequência desta data.
                Todos os alunos serão marcados como presentes inicialmente.
              </Typography>
              <Button
                variant="contained"
                size="large"
                color="primary"
                startIcon={<EventNote />}
                onClick={handleIniciarChamada}
              >
                Iniciar Chamada
              </Button>
            </Paper>
          )}
          
          {/* Tabela visível apenas se chamada foi iniciada OU há dados salvos */}
          {chamadaIniciada && (
          <Paper>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6">
                  Lista de Presença - {new Date(filtros.data + 'T12:00:00').toLocaleDateString('pt-BR')}
                </Typography>
                {Object.keys(frequencias).length > 0 ? (
                  <Chip 
                    label="Salvo" 
                    color="success" 
                    size="small" 
                    icon={<CheckCircle />}
                  />
                ) : (
                  <Chip 
                    label="Não salvo" 
                    color="warning" 
                    size="small" 
                    variant="outlined"
                  />
                )}
              </Box>
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
          )}
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
            <Typography variant="h6">Importar Frequências</Typography>
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
                Faça upload de um arquivo CSV ou Excel (.xlsx) com as frequências.
                Use códigos rápidos: <strong>P</strong> (Presente), <strong>F</strong> (Falta), <strong>FJ</strong> (Falta Justificada), <strong>A</strong> (Atestado).
              </Alert>

              {/* Seletores para template personalizado */}
              <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  Template Personalizado por Turma
                </Typography>
                <Typography variant="caption" display="block" sx={{ mb: 2, color: 'text.secondary' }}>
                  Baixe um template com todos os alunos da turma já preenchidos
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Selecione a Turma"
                      value={turmaSelecionadaTemplate}
                      onChange={(e) => {
                        setTurmaSelecionadaTemplate(e.target.value);
                        setDisciplinaSelecionadaTemplate('');
                      }}
                      size="small"
                    >
                      <MenuItem value="">
                        <em>Template genérico</em>
                      </MenuItem>
                      {turmas.map((turma) => (
                        <MenuItem key={turma._id} value={turma._id}>
                          {turma.nome}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Disciplina (opcional)"
                      value={disciplinaSelecionadaTemplate}
                      onChange={(e) => setDisciplinaSelecionadaTemplate(e.target.value)}
                      disabled={!turmaSelecionadaTemplate}
                      size="small"
                    >
                      <MenuItem value="">
                        <em>Todas as disciplinas</em>
                      </MenuItem>
                      {disciplinas.map((disciplina) => (
                        <MenuItem key={disciplina._id} value={disciplina._id}>
                          {disciplina.nome}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Box>

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
                    {importData.length} registros prontos para importar
                  </Alert>
                  <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
                    <List dense>
                      {importData.slice(0, 10).map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`${item.aluno_nome || item.matricula_aluno} - ${item.data}`}
                            secondary={`${item.disciplina_nome || item.codigo_disciplina} | Status: ${item.status || 'presente'}`}
                          />
                        </ListItem>
                      ))}
                      {importData.length > 10 && (
                        <ListItem>
                          <ListItemText secondary={`... e mais ${importData.length - 10} registros`} />
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
                  • data (formato: AAAA-MM-DD)<br />
                  <br />
                  <strong>Opcionais:</strong><br />
                  • professor_nome<br />
                  • status (presente, falta, falta-justificada, atestado - padrão: presente)<br />
                  • periodo (matutino, vespertino, noturno, integral)<br />
                  • observacao
                </Typography>
              </Paper>
              <Alert severity="warning">
                <Typography variant="body2">
                  <strong>Importante:</strong> O sistema buscará alunos pela matrícula ou nome,
                  disciplinas pelo código ou nome, e turmas pelo nome. Para a mesma data/aluno/disciplina,
                  o registro existente será atualizado.
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

export default Frequencias;
