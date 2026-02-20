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
} from '@mui/icons-material';
import { frequenciaService, turmaService, disciplinaService, alunoService } from '../services';
import { toast } from 'react-toastify';
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

  // Dialog de justificativa
  const [dialogJustificativa, setDialogJustificativa] = useState(false);
  const [alunoJustificar, setAlunoJustificar] = useState(null);
  const [justificativa, setJustificativa] = useState('');

  // Importação
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [importData, setImportData] = useState([]);
  const [tabValue, setTabValue] = useState(0);

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

  const downloadTemplate = (format = 'csv') => {
    const dataExemplo = new Date().toISOString().split('T')[0];
    
    if (format === 'excel') {
      const ws = XLSX.utils.json_to_sheet([
        {
          matricula_aluno: '2026001',
          aluno_nome: 'João Silva',
          codigo_disciplina: 'MAT',
          disciplina_nome: 'Matemática',
          turma_nome: '1º Ano A',
          professor_nome: 'Prof. Carlos',
          data: dataExemplo,
          status: 'presente',
          periodo: 'matutino',
          observacao: ''
        },
        {
          matricula_aluno: '2026002',
          aluno_nome: 'Ana Santos',
          codigo_disciplina: 'POR',
          disciplina_nome: 'Português',
          turma_nome: '2º Ano B',
          professor_nome: 'Prof. Maria',
          data: dataExemplo,
          status: 'falta',
          periodo: 'vespertino',
          observacao: 'Aluna avisou'
        },
        {
          matricula_aluno: '2026003',
          aluno_nome: 'Pedro Costa',
          codigo_disciplina: 'MAT',
          disciplina_nome: 'Matemática',
          turma_nome: '3º Ano C',
          professor_nome: 'Prof. Carlos',
          data: dataExemplo,
          status: 'falta-justificada',
          periodo: 'matutino',
          observacao: 'Atestado médico'
        }
      ]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Frequências');
      XLSX.writeFile(wb, 'template_frequencias.xlsx');
    } else {
      const csv = 'matricula_aluno,aluno_nome,codigo_disciplina,disciplina_nome,turma_nome,professor_nome,data,status,periodo,observacao\n' +
                  `2026001,João Silva,MAT,Matemática,1º Ano A,Prof. Carlos,${dataExemplo},presente,matutino,\n` +
                  `2026002,Ana Santos,POR,Português,2º Ano B,Prof. Maria,${dataExemplo},falta,vespertino,Aluna avisou\n` +
                  `2026003,Pedro Costa,MAT,Matemática,3º Ano C,Prof. Carlos,${dataExemplo},falta-justificada,matutino,Atestado médico`;
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'template_frequencias.csv';
      link.click();
    }
  };

  const statusGeral = getFrequenciaStatus(parseFloat(stats.percentual));

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Controle de Frequência
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Registre a presença dos alunos diariamente
            </Typography>
          </Box>
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
                Campos obrigatórios: matricula_aluno ou aluno_nome, codigo_disciplina ou disciplina_nome, turma_nome, data.
              </Alert>

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
