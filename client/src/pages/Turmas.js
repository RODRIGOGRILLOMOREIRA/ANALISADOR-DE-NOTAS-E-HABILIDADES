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
  Fade,
  Zoom,
} from '@mui/material';
import { Add, Edit, Delete, Upload, Download } from '@mui/icons-material';
import { turmaService, professorService, disciplinaService } from '../services';
import { toast } from 'react-toastify';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import PageHeader from '../components/PageHeader';
import { People as TurmasIcon } from '@mui/icons-material';

const Turmas = () => {
  const [turmas, setTurmas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    nome: '',
    ano: new Date().getFullYear(),
    serie: '',
    turno: 'matutino',
    capacidadeMaxima: 35,
  });
  const [editId, setEditId] = useState(null);
  const [importData, setImportData] = useState([]);

  useEffect(() => {
    loadTurmas();
    loadProfessores();
    loadDisciplinas();
  }, []);

  const loadTurmas = async () => {
    try {
      const data = await turmaService.getAll();
      setTurmas(data);
    } catch (error) {
      toast.error('Erro ao carregar turmas');
    }
  };

  const loadProfessores = async () => {
    try {
      const data = await professorService.getAll();
      setProfessores(data);
    } catch (error) {
      console.error('Erro ao carregar professores');
    }
  };

  const loadDisciplinas = async () => {
    try {
      const data = await disciplinaService.getAll();
      setDisciplinas(data);
    } catch (error) {
      console.error('Erro ao carregar disciplinas');
    }
  };

  const handleOpen = (turma = null) => {
    if (turma) {
      setFormData({
        nome: turma.nome,
        ano: turma.ano,
        serie: turma.serie,
        turno: turma.turno,
        capacidadeMaxima: turma.capacidadeMaxima || 35,
      });
      setEditId(turma._id);
    } else {
      setFormData({
        nome: '',
        ano: new Date().getFullYear(),
        serie: '',
        turno: 'matutino',
        capacidadeMaxima: 35,
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
      ano: new Date().getFullYear(),
      serie: '',
      turno: 'matutino',
      capacidadeMaxima: 35,
    });
    setEditId(null);
    setImportData([]);
    setTabValue(0);
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await turmaService.update(editId, formData);
        toast.success('Turma atualizada com sucesso!');
      } else {
        await turmaService.create(formData);
        toast.success('Turma criada com sucesso!');
      }
      handleClose();
      loadTurmas();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao salvar turma');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta turma?')) {
      try {
        await turmaService.delete(id);
        toast.success('Turma excluída com sucesso!');
        loadTurmas();
      } catch (error) {
        toast.error('Erro ao excluir turma');
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
            row.nome && row.serie && row.turno
          );
          setImportData(validData);
          if (validData.length > 0) {
            toast.success(`${validData.length} turmas encontradas no arquivo Excel`);
          } else {
            toast.error('Nenhuma turma válida encontrada no arquivo');
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
            row.nome && row.serie && row.turno
          );
          setImportData(validData);
          if (validData.length > 0) {
            toast.success(`${validData.length} turmas encontradas no arquivo CSV`);
          } else {
            toast.error('Nenhuma turma válida encontrada no arquivo');
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
      toast.error('Nenhuma turma para importar');
      return;
    }

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const row of importData) {
        try {
          await turmaService.create({
            nome: row.nome,
            ano: row.ano || new Date().getFullYear(),
            serie: row.serie,
            turno: row.turno.toLowerCase(),
            capacidadeMaxima: row.capacidadeMaxima || 35,
          });
          successCount++;
        } catch (error) {
          errorCount++;
          console.error('Erro ao importar turma:', row.nome, error);
        }
      }

      toast.success(`${successCount} turmas importadas com sucesso!`);
      if (errorCount > 0) {
        toast.warning(`${errorCount} turmas com erro`);
      }
      
      handleClose();
      loadTurmas();
    } catch (error) {
      toast.error('Erro ao importar turmas');
    }
  };

  const downloadTemplate = (format = 'csv') => {
    if (format === 'excel') {
      // Criar template Excel
      const ws = XLSX.utils.json_to_sheet([
        { nome: '1º Ano A', ano: 2026, serie: '1º Ano', turno: 'matutino', capacidadeMaxima: 35 },
        { nome: '2º Ano B', ano: 2026, serie: '2º Ano', turno: 'vespertino', capacidadeMaxima: 30 },
        { nome: '3º Ano C', ano: 2026, serie: '3º Ano', turno: 'matutino', capacidadeMaxima: 32 }
      ]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Turmas');
      XLSX.writeFile(wb, 'template_turmas.xlsx');
    } else {
      // Criar template CSV
      const csv = 'nome,ano,serie,turno,capacidadeMaxima\n' +
                  '1º Ano A,2026,1º Ano,matutino,35\n' +
                  '2º Ano B,2026,2º Ano,vespertino,30\n' +
                  '3º Ano C,2026,3º Ano,matutino,32';
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'template_turmas.csv';
      link.click();
    }
  };

  const getTurnoColor = (turno) => {
    const colors = {
      matutino: 'primary',
      vespertino: 'secondary',
      noturno: 'default',
      integral: 'success'
    };
    return colors[turno] || 'default';
  };

  return (
    <Container maxWidth="xl">
      <PageHeader 
        title="Turmas"
        subtitle="Organize e gerencie as turmas da escola"
        icon={TurmasIcon}
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
            Nova Turma
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
              <TableCell sx={{ fontWeight: 700 }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Ano</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Série</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Turno</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Alunos</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Capacidade</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {turmas.map((turma) => (
              <TableRow 
                key={turma._id}
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
                <TableCell>{turma.nome}</TableCell>
                <TableCell>{turma.ano}</TableCell>
                <TableCell>{turma.serie}</TableCell>
                <TableCell>
                  <Chip 
                    label={turma.turno} 
                    color={getTurnoColor(turma.turno)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  {turma.alunos?.length || 0}
                </TableCell>
                <TableCell align="center">
                  {turma.capacidadeMaxima || 35}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(turma)}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(turma._id)}
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
          {editId ? 'Editar Turma' : 'Nova Turma'}
        </DialogTitle>
        <DialogContent>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
            <Tab label="Cadastro Manual" />
            <Tab label="Importar Arquivo" disabled={!!editId} />
          </Tabs>

          {tabValue === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                autoFocus
                label="Nome da Turma"
                fullWidth
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: 1º Ano A"
              />
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Ano"
                  type="number"
                  value={formData.ano}
                  onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Série"
                  fullWidth
                  value={formData.serie}
                  onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
                  placeholder="Ex: 1º Ano"
                  sx={{ flex: 2 }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  select
                  label="Turno"
                  value={formData.turno}
                  onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
                  sx={{ flex: 1 }}
                >
                  <MenuItem value="matutino">Matutino</MenuItem>
                  <MenuItem value="vespertino">Vespertino</MenuItem>
                  <MenuItem value="noturno">Noturno</MenuItem>
                  <MenuItem value="integral">Integral</MenuItem>
                </TextField>

                <TextField
                  label="Capacidade Máxima"
                  type="number"
                  value={formData.capacidadeMaxima}
                  onChange={(e) => setFormData({ ...formData, capacidadeMaxima: parseInt(e.target.value) })}
                  sx={{ flex: 1 }}
                  inputProps={{ min: 1, max: 50 }}
                />
              </Box>
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <strong>Formatos aceitos: CSV e Excel (.xlsx)</strong>
                <br />
                Colunas: nome, ano, serie, turno, capacidadeMaxima
                <br />
                Turnos válidos: matutino, vespertino, noturno, integral
              </Alert>

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
                    {importData.length} turmas prontas para importar:
                  </Typography>
                  <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
                    <List dense>
                      {importData.map((row, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={row.nome}
                            secondary={`${row.serie} - ${row.turno} - Ano: ${row.ano || 2026}`}
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
              Importar {importData.length} Turmas
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Turmas;
