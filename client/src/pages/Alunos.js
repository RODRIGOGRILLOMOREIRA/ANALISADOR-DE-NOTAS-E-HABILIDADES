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
  MenuItem,
  Chip,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Grid,
  Fade,
  Zoom,
} from '@mui/material';
import { Add, Edit, Delete, Upload, Download } from '@mui/icons-material';
import { alunoService, turmaService } from '../services';
import { toast } from 'react-toastify';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import PageHeader from '../components/PageHeader';
import { Person as AlunosIcon } from '@mui/icons-material';

const Alunos = () => {
  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    nome: '',
    matricula: '',
    dataNascimento: '',
    turma: '',
    responsavel: {
      nome: '',
      telefone: '',
      email: '',
    },
  });
  const [editId, setEditId] = useState(null);
  const [importData, setImportData] = useState([]);
  const [turmaSelecionadaTemplate, setTurmaSelecionadaTemplate] = useState('');

  useEffect(() => {
    loadAlunos();
    loadTurmas();
  }, []);

  const loadAlunos = async () => {
    try {
      const data = await alunoService.getAll();
      setAlunos(data);
    } catch (error) {
      toast.error('Erro ao carregar alunos');
    }
  };

  const loadTurmas = async () => {
    try {
      const data = await turmaService.getAll();
      setTurmas(data);
    } catch (error) {
      console.error('Erro ao carregar turmas');
    }
  };

  const handleOpen = (aluno = null) => {
    if (aluno) {
      setFormData({
        nome: aluno.nome,
        matricula: aluno.matricula,
        dataNascimento: aluno.dataNascimento ? aluno.dataNascimento.split('T')[0] : '',
        turma: aluno.turma?._id || '',
        responsavel: {
          nome: aluno.responsavel?.nome || '',
          telefone: aluno.responsavel?.telefone || '',
          email: aluno.responsavel?.email || '',
        },
      });
      setEditId(aluno._id);
    } else {
      setFormData({
        nome: '',
        matricula: '',
        dataNascimento: '',
        turma: '',
        responsavel: {
          nome: '',
          telefone: '',
          email: '',
        },
      });
      setEditId(null);
    }
    setTabValue(0);
    setImportData([]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      nome: '',
      matricula: '',
      dataNascimento: '',
      turma: '',
      responsavel: {
        nome: '',
        telefone: '',
        email: '',
      },
    });
    setEditId(null);
    setImportData([]);
    setTabValue(0);
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await alunoService.update(editId, formData);
        toast.success('Aluno atualizado com sucesso!');
      } else {
        await alunoService.create(formData);
        toast.success('Aluno cadastrado com sucesso!');
      }
      handleClose();
      loadAlunos();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao salvar aluno');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        await alunoService.delete(id);
        toast.success('Aluno excluído com sucesso!');
        loadAlunos();
      } catch (error) {
        toast.error('Erro ao excluir aluno');
      }
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

    if (isExcel) {
      // Processar arquivo Excel
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          
          const validData = jsonData.filter(row => 
            row.nome && row.matricula
          );
          setImportData(validData);
          if (validData.length > 0) {
            toast.success(`${validData.length} alunos encontrados no arquivo Excel`);
          } else {
            toast.error('Nenhum aluno válido encontrado no arquivo');
          }
        } catch (error) {
          toast.error('Erro ao ler arquivo Excel: ' + error.message);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Processar arquivo CSV
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const validData = results.data.filter(row => 
            row.nome && row.matricula
          );
          setImportData(validData);
          if (validData.length > 0) {
            toast.success(`${validData.length} alunos encontrados no arquivo CSV`);
          } else {
            toast.error('Nenhum aluno válido encontrado no arquivo');
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
      toast.error('Nenhum aluno para importar');
      return;
    }

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const row of importData) {
        try {
          // Buscar turma pelo nome se fornecido
          let turmaId = null;
          if (row.turma && turmas.length > 0) {
            const turmaEncontrada = turmas.find(t => 
              t.nome.toLowerCase() === row.turma.toLowerCase()
            );
            turmaId = turmaEncontrada?._id;
          }

          await alunoService.create({
            nome: row.nome,
            matricula: row.matricula,
            dataNascimento: row.dataNascimento || null,
            turma: turmaId,
            responsavel: {
              nome: row.responsavel_nome || '',
              telefone: row.responsavel_telefone || '',
              email: row.responsavel_email || '',
            },
          });
          successCount++;
        } catch (error) {
          errorCount++;
          console.error('Erro ao importar aluno:', row.nome, error);
        }
      }

      toast.success(`${successCount} alunos importados com sucesso!`);
      if (errorCount > 0) {
        toast.warning(`${errorCount} alunos com erro`);
      }
      
      handleClose();
      loadAlunos();
    } catch (error) {
      toast.error('Erro ao importar alunos');
    }
  };

  const downloadTemplate = async (format = 'csv') => {
    try {
      // Se há turma selecionada, baixar template personalizado
      if (turmaSelecionadaTemplate) {
        const response = await alunoService.getTemplatePorTurma(turmaSelecionadaTemplate);
        const { turma, template, instrucoes } = response;

        if (format === 'excel') {
          const ws = XLSX.utils.json_to_sheet(template);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Alunos');
          
          // Adicionar instruções em outra aba
          const wsInstrucoes = XLSX.utils.aoa_to_sheet([
            ['INSTRUÇÕES PARA PREENCHIMENTO DE ALUNOS'],
            [''],
            ['INFORMAÇÕES DA TURMA:'],
            [`Turma: ${turma.nome}`],
            [`Ano: ${turma.ano}`],
            [`Série: ${turma.serie}`],
            [`Turno: ${turma.turno}`],
            [`Capacidade Máxima: ${turma.capacidadeMaxima} alunos`],
            [''],
            ['INSTRUÇÕES:'],
            [instrucoes.turma],
            [instrucoes.matricula],
            [instrucoes.dataNascimento],
            [instrucoes.responsavel],
            [instrucoes.dica],
            [''],
            ['IMPORTANTE:'],
            ['- Campo "turma" já está preenchido, não altere'],
            ['- Data de nascimento no formato AAAA-MM-DD'],
            ['- Preencha todos os dados do responsável'],
            ['- As 2 primeiras linhas são exemplos, podem ser apagadas'],
          ]);
          XLSX.utils.book_append_sheet(wb, wsInstrucoes, 'Instruções');
          
          const fileName = `alunos_${turma.nome.replace(/\s+/g, '_')}.xlsx`;
          XLSX.writeFile(wb, fileName);
        } else {
          const csv = Papa.unparse(template);
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          const fileName = `alunos_${turma.nome.replace(/\s+/g, '_')}.csv`;
          link.download = fileName;
          link.click();
        }

        toast.success(`Template para turma ${turma.nome} baixado com sucesso!`);
        return;
      }

      // Template genérico (comportamento anterior)
      if (format === 'excel') {
        // Criar template Excel
        const ws = XLSX.utils.json_to_sheet([
          {
            nome: 'João Silva',
            matricula: '2026001',
            dataNascimento: '2010-05-15',
            turma: '1º Ano A',
            responsavel_nome: 'Maria Silva',
            responsavel_telefone: '(11) 98765-4321',
            responsavel_email: 'maria@email.com'
          },
          {
            nome: 'Ana Santos',
            matricula: '2026002',
            dataNascimento: '2011-08-20',
            turma: '2º Ano B',
            responsavel_nome: 'Carlos Santos',
            responsavel_telefone: '(11) 91234-5678',
            responsavel_email: 'carlos@email.com'
          },
          {
            nome: 'Pedro Costa',
            matricula: '2026003',
            dataNascimento: '2009-03-10',
            turma: '3º Ano C',
            responsavel_nome: 'Lucia Costa',
            responsavel_telefone: '(11) 99876-5432',
            responsavel_email: 'lucia@email.com'
          }
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Alunos');
        XLSX.writeFile(wb, 'template_alunos.xlsx');
      } else {
        // Criar template CSV
        const csv = 'nome,matricula,dataNascimento,turma,responsavel_nome,responsavel_telefone,responsavel_email\n' +
                    'João Silva,2026001,2010-05-15,1º Ano A,Maria Silva,(11) 98765-4321,maria@email.com\n' +
                    'Ana Santos,2026002,2011-08-20,2º Ano B,Carlos Santos,(11) 91234-5678,carlos@email.com\n' +
                    'Pedro Costa,2026003,2009-03-10,3º Ano C,Lucia Costa,(11) 99876-5432,lucia@email.com';
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'template_alunos.csv';
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Container maxWidth="xl">
      <PageHeader 
        title="Alunos"
        subtitle="Gerencie os estudantes matriculados na instituição"
        icon={AlunosIcon}
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
            Novo Aluno
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
              <TableCell sx={{ fontWeight: 700 }}>Matrícula</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Data Nascimento</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Turma</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Responsável</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alunos.map((aluno) => (
              <TableRow 
                key={aluno._id}
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
                <TableCell>
                  <Chip label={aluno.matricula} size="small" color="primary" variant="outlined" />
                </TableCell>
                <TableCell>{aluno.nome}</TableCell>
                <TableCell>{formatDate(aluno.dataNascimento)}</TableCell>
                <TableCell>
                  {aluno.turma?.nome || '-'}
                </TableCell>
                <TableCell>{aluno.responsavel?.nome || '-'}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(aluno)}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(aluno._id)}
                    size="small"
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

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editId ? 'Editar Aluno' : 'Novo Aluno'}
        </DialogTitle>
        <DialogContent>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
            <Tab label="Cadastro Manual" />
            <Tab label="Importar Arquivo" disabled={!!editId} />
          </Tabs>

          {tabValue === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Typography variant="h6" sx={{ mt: 1 }}>
                Dados do Aluno
              </Typography>
              
              <TextField
                autoFocus
                label="Nome Completo"
                fullWidth
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: João Silva Santos"
              />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Matrícula"
                    fullWidth
                    value={formData.matricula}
                    onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                    placeholder="Ex: 2026001"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Data de Nascimento"
                    type="date"
                    fullWidth
                    value={formData.dataNascimento}
                    onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              <TextField
                select
                label="Turma"
                value={formData.turma}
                onChange={(e) => setFormData({ ...formData, turma: e.target.value })}
                fullWidth
              >
                <MenuItem value="">Sem turma</MenuItem>
                {turmas.map((turma) => (
                  <MenuItem key={turma._id} value={turma._id}>
                    {turma.nome} - {turma.serie} ({turma.turno})
                  </MenuItem>
                ))}
              </TextField>

              <Typography variant="h6" sx={{ mt: 2 }}>
                Dados do Responsável
              </Typography>

              <TextField
                label="Nome do Responsável"
                fullWidth
                value={formData.responsavel.nome}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  responsavel: { ...formData.responsavel, nome: e.target.value }
                })}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Telefone"
                    fullWidth
                    value={formData.responsavel.telefone}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      responsavel: { ...formData.responsavel, telefone: e.target.value }
                    })}
                    placeholder="(11) 98765-4321"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={formData.responsavel.email}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      responsavel: { ...formData.responsavel, email: e.target.value }
                    })}
                    placeholder="responsavel@email.com"
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <strong>Formatos aceitos: CSV e Excel (.xlsx)</strong>
                <br />
                Colunas: nome, matricula, dataNascimento, turma, responsavel_nome, responsavel_telefone, responsavel_email
                <br />
                Data no formato: AAAA-MM-DD (ex: 2010-05-15)
                <br />
                Turma: nome exato da turma cadastrada
              </Alert>

              {/* Seletor para template personalizado */}
              <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  Template Personalizado por Turma
                </Typography>
                <Typography variant="caption" display="block" sx={{ mb: 2, color: 'text.secondary' }}>
                  Baixe um template com o nome da turma já preenchido
                </Typography>
                
                <TextField
                  select
                  fullWidth
                  label="Selecione a Turma"
                  value={turmaSelecionadaTemplate}
                  onChange={(e) => setTurmaSelecionadaTemplate(e.target.value)}
                  size="small"
                >
                  <MenuItem value="">
                    <em>Template genérico (todas as turmas)</em>
                  </MenuItem>
                  {turmas.map((turma) => (
                    <MenuItem key={turma._id} value={turma._id}>
                      {turma.nome} - {turma.serie} ({turma.turno})
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => downloadTemplate('csv')}
                >
                  Baixar Modelo CSV
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => downloadTemplate('excel')}
                  color="success"
                >
                  Baixar Modelo Excel
                </Button>

                <Button
                  variant="contained"
                  component="label"
                  startIcon={<Upload />}
                >
                  Selecionar Arquivo
                  <input
                    type="file"
                    hidden
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                  />
                </Button>
              </Box>

              {importData.length > 0 && (
                <>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {importData.length} alunos prontos para importar:
                  </Typography>
                  <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
                    <List dense>
                      {importData.map((row, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`${row.nome} - ${row.matricula}`}
                            secondary={`Turma: ${row.turma || 'Não definida'} | Responsável: ${row.responsavel_nome || '-'}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          {tabValue === 0 ? (
            <Button onClick={handleSubmit} variant="contained">
              Salvar
            </Button>
          ) : (
            <Button 
              onClick={handleImport} 
              variant="contained"
              disabled={importData.length === 0}
            >
              Importar {importData.length} Alunos
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Alunos;
