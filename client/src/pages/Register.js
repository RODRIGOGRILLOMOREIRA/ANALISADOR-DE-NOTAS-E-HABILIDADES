import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Tooltip,
  Grid,
  Alert,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  School,
  LockOutlined,
  PersonOutline,
  Brightness4,
  Brightness7,
  Email,
  ArrowBack,
} from '@mui/icons-material';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSchool } from '../context/SchoolContext';

const Register = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { schoolSettings } = useSchool();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipo: 'professor'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha) {
      setError('Preencha todos os campos');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      return;
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        tipo: formData.tipo
      });

      toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao realizar cadastro';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Estilo do gradiente baseado no tema
  const gradientBg = isDarkMode
    ? 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

  const buttonGradient = isDarkMode
    ? 'linear-gradient(135deg, #00bcd4 0%, #26c6da 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: gradientBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        p: 2,
      }}
    >
      {/* Toggle de Tema */}
      <Tooltip title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}>
        <IconButton
          onClick={toggleTheme}
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            color: 'white',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          {isDarkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Tooltip>

      {/* Botão Voltar */}
      <Tooltip title="Voltar para Login">
        <IconButton
          onClick={() => navigate('/login')}
          sx={{
            position: 'absolute',
            top: 20,
            left: 20,
            color: 'white',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <ArrowBack />
        </IconButton>
      </Tooltip>

      {/* Elementos decorativos */}
      <Box
        sx={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          top: '-150px',
          left: '-150px',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.03)',
          bottom: '-200px',
          right: '-200px',
        }}
      />

      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
            backgroundColor: isDarkMode
              ? 'rgba(30, 30, 30, 0.9)'
              : 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            {/* Logo da Escola */}
            {schoolSettings?.logo ? (
              <Avatar
                key={schoolSettings.logo}
                src={schoolSettings.logo}
                alt="Logo da Escola"
                imgProps={{ 
                  onError: (e) => {
                    console.error('Erro ao carregar logo no registro');
                    e.target.style.display = 'none';
                  }
                }}
                sx={{ width: 80, height: 80, margin: '0 auto', mb: 2 }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  margin: '0 auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                }}
              >
                <School sx={{ fontSize: 50 }} />
              </Avatar>
            )}
            
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Criar Conta
            </Typography>
            
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {schoolSettings?.nomeEscola || 'Sistema de Gestão Escolar'}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Preencha os dados para criar sua conta
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Nome Completo */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome Completo"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutline />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Tipo de Usuário */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Usuário</InputLabel>
                  <Select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    label="Tipo de Usuário"
                  >
                    <MenuItem value="admin">Administrador</MenuItem>
                    <MenuItem value="coordenador">Coordenador</MenuItem>
                    <MenuItem value="professor">Professor</MenuItem>
                    <MenuItem value="aluno">Aluno</MenuItem>
                    <MenuItem value="responsavel">Responsável</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Senha */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Senha"
                  name="senha"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.senha}
                  onChange={handleChange}
                  required
                  helperText="Mínimo 6 caracteres"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Confirmar Senha */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirmar Senha"
                  name="confirmarSenha"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Botão de Cadastro */}
              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    background: buttonGradient,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Cadastrar'
                  )}
                </Button>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Já tem uma conta?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Faça login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
