import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  Save,
  PhotoCamera,
  Delete,
  School,
  Lock,
  Info,
  Settings,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useSchool } from '../context/SchoolContext';

const Configuracoes = () => {
  const [searchParams] = useSearchParams();
  const { loadSchoolSettings } = useSchool();
  const [tabValue, setTabValue] = useState(searchParams.get('tab') === 'senha' ? 1 : 0);
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const [settings, setSettings] = useState({
    nomeEscola: '',
    logo: null,
    endereco: {
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    },
    contato: {
      telefone: '',
      celular: '',
      email: '',
      site: ''
    },
    redesSociais: {
      facebook: '',
      instagram: '',
      twitter: ''
    },
    informacoesAdicionais: {
      cnpj: '',
      inep: '',
      diretor: '',
      coordenador: '',
      horarioFuncionamento: ''
    },
    configuracoes: {
      anoLetivoAtual: new Date().getFullYear(),
      trimestreAtual: 1,
      notaMinimaAprovacao: 6.0,
      frequenciaMinimaAprovacao: 75
    }
  });

  const [senhaData, setSenhaData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/settings');
      // Merge com o estado inicial para garantir que todas as propriedades existam
      setSettings(prevSettings => ({
        ...prevSettings,
        ...response.data,
        endereco: { ...prevSettings.endereco, ...(response.data.endereco || {}) },
        contato: { ...prevSettings.contato, ...(response.data.contato || {}) },
        redesSociais: { ...prevSettings.redesSociais, ...(response.data.redesSociais || {}) },
        informacoesAdicionais: { ...prevSettings.informacoesAdicionais, ...(response.data.informacoesAdicionais || {}) },
        configuracoes: { ...prevSettings.configuracoes, ...(response.data.configuracoes || {}) }
      }));
      if (response.data.logo) {
        setLogoPreview(response.data.logo);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/settings', settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Atualizar SchoolContext imediatamente
      if (response.data.settings) {
        await loadSchoolSettings();
      }
      
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          // Criar uma imagem para redimensionar
          const img = new Image();
          img.src = reader.result;
          
          img.onload = async () => {
            // Redimensionar para no máximo 300x300px mantendo proporção
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            let width = img.width;
            let height = img.height;
            const maxSize = 300;
            
            if (width > height) {
              if (width > maxSize) {
                height = (height * maxSize) / width;
                width = maxSize;
              }
            } else {
              if (height > maxSize) {
                width = (width * maxSize) / height;
                height = maxSize;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            // Converter para base64 com qualidade otimizada
            const base64 = canvas.toDataURL('image/jpeg', 0.8);
            setLogoPreview(base64);
            
            try {
              const token = localStorage.getItem('token');
              const response = await axios.post('http://localhost:5000/api/settings/logo', 
                { logo: base64 },
                { headers: { Authorization: `Bearer ${token}` }}
              );
              
              console.log('Resposta do upload:', response.data);
              
              // Atualizar estado local
              setSettings({ ...settings, logo: base64 });
              
              // Atualizar SchoolContext imediatamente
              if (response.data.settings) {
                await loadSchoolSettings();
              }
              
              toast.success('Logo atualizada com sucesso!');
            } catch (error) {
              console.error('Erro ao fazer upload:', error);
              toast.error(error.response?.data?.message || 'Erro ao fazer upload da logo');
              setLogoPreview(null);
            }
          };
          
          img.onerror = () => {
            toast.error('Erro ao processar a imagem');
          };
        } catch (error) {
          console.error('Erro ao processar imagem:', error);
          toast.error('Erro ao processar a imagem');
        }
      };
      
      reader.onerror = () => {
        toast.error('Erro ao ler o arquivo');
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteLogo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete('http://localhost:5000/api/settings/logo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setLogoPreview(null);
      setSettings({ ...settings, logo: null });
      
      // Atualizar SchoolContext imediatamente
      if (response.data.settings) {
        await loadSchoolSettings();
      }
      
      toast.success('Logo removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover logo:', error);
      toast.error(error.response?.data?.message || 'Erro ao remover logo');
    }
  };

  const handleChangeSenha = async () => {
    if (senhaData.novaSenha !== senhaData.confirmarSenha) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (senhaData.novaSenha.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/auth/change-password', 
        {
          senhaAtual: senhaData.senhaAtual,
          novaSenha: senhaData.novaSenha
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      toast.success('Senha alterada com sucesso!');
      setSenhaData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao alterar senha');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Configurações do Sistema
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gerencie as configurações da escola e do sistema
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
        >
          <Tab icon={<School />} label="Escola" />
          <Tab icon={<Lock />} label="Senha" />
          <Tab icon={<Settings />} label="Sistema" />
        </Tabs>
      </Paper>

      {/* ABA 1: Informações da Escola */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Upload de Logo */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Logo da Escola
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  {logoPreview ? (
                    <Avatar
                      src={logoPreview}
                      sx={{ width: 150, height: 150 }}
                    />
                  ) : (
                    <Avatar
                      sx={{ width: 150, height: 150, bgcolor: 'primary.main' }}
                    >
                      <School sx={{ fontSize: 80 }} />
                    </Avatar>
                  )}
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<PhotoCamera />}
                    >
                      Upload
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                    </Button>
                    {logoPreview && (
                      <IconButton color="error" onClick={handleDeleteLogo}>
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" textAlign="center">
                    Recomendado: 300x300px, PNG ou JPG
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Informações Básicas */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Informações Básicas
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nome da Escola"
                      value={settings.nomeEscola || ''}
                      onChange={(e) => setSettings({ ...settings, nomeEscola: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CNPJ"
                      value={settings.informacoesAdicionais?.cnpj || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        informacoesAdicionais: { ...settings.informacoesAdicionais, cnpj: e.target.value }
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Código INEP"
                      value={settings.informacoesAdicionais?.inep || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        informacoesAdicionais: { ...settings.informacoesAdicionais, inep: e.target.value }
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Diretor(a)"
                      value={settings.informacoesAdicionais?.diretor || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        informacoesAdicionais: { ...settings.informacoesAdicionais, diretor: e.target.value }
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Coordenador(a)"
                      value={settings.informacoesAdicionais?.coordenador || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        informacoesAdicionais: { ...settings.informacoesAdicionais, coordenador: e.target.value }
                      })}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Endereço */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Endereço
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      fullWidth
                      label="Rua"
                      value={settings.endereco?.rua || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        endereco: { ...settings.endereco, rua: e.target.value }
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Número"
                      value={settings.endereco?.numero || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        endereco: { ...settings.endereco, numero: e.target.value }
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Complemento"
                      value={settings.endereco?.complemento || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        endereco: { ...settings.endereco, complemento: e.target.value }
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Bairro"
                      value={settings.endereco?.bairro || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        endereco: { ...settings.endereco, bairro: e.target.value }
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="CEP"
                      value={settings.endereco?.cep || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        endereco: { ...settings.endereco, cep: e.target.value }
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      fullWidth
                      label="Cidade"
                      value={settings.endereco?.cidade || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        endereco: { ...settings.endereco, cidade: e.target.value }
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Estado"
                      value={settings.endereco?.estado || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        endereco: { ...settings.endereco, estado: e.target.value }
                      })}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Contato */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Contato
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefone"
                      value={settings.contato?.telefone || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        contato: { ...settings.contato, telefone: e.target.value }
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Celular"
                      value={settings.contato?.celular || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        contato: { ...settings.contato, celular: e.target.value }
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={settings.contato?.email || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        contato: { ...settings.contato, email: e.target.value }
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Site"
                      value={settings.contato?.site || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        contato: { ...settings.contato, site: e.target.value }
                      })}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Save />}
                onClick={handleSaveSettings}
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* ABA 2: Redefinir Senha */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Redefinir Senha
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Por segurança, digite sua senha atual antes de definir uma nova.
                </Alert>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Senha Atual"
                      value={senhaData.senhaAtual}
                      onChange={(e) => setSenhaData({ ...senhaData, senhaAtual: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Nova Senha"
                      value={senhaData.novaSenha}
                      onChange={(e) => setSenhaData({ ...senhaData, novaSenha: e.target.value })}
                      helperText="Mínimo 6 caracteres"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Confirmar Nova Senha"
                      value={senhaData.confirmarSenha}
                      onChange={(e) => setSenhaData({ ...senhaData, confirmarSenha: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleChangeSenha}
                    >
                      Alterar Senha
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* ABA 3: Configurações do Sistema */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Ano Letivo
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Ano Letivo Atual"
                      value={settings.configuracoes?.anoLetivoAtual || new Date().getFullYear()}
                      onChange={(e) => setSettings({
                        ...settings,
                        configuracoes: { ...settings.configuracoes, anoLetivoAtual: parseInt(e.target.value) }
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Trimestre Atual"
                      value={settings.configuracoes?.trimestreAtual || 1}
                      onChange={(e) => setSettings({
                        ...settings,
                        configuracoes: { ...settings.configuracoes, trimestreAtual: parseInt(e.target.value) }
                      })}
                      inputProps={{ min: 1, max: 3 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Nota Mínima para Aprovação"
                      value={settings.configuracoes?.notaMinimaAprovacao || 6.0}
                      onChange={(e) => setSettings({
                        ...settings,
                        configuracoes: { ...settings.configuracoes, notaMinimaAprovacao: parseFloat(e.target.value) }
                      })}
                      inputProps={{ min: 0, max: 10, step: 0.1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Frequência Mínima (%)"
                      value={settings.configuracoes?.frequenciaMinimaAprovacao || 75}
                      onChange={(e) => setSettings({
                        ...settings,
                        configuracoes: { ...settings.configuracoes, frequenciaMinimaAprovacao: parseInt(e.target.value) }
                      })}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Save />}
                onClick={handleSaveSettings}
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Configuracoes;
