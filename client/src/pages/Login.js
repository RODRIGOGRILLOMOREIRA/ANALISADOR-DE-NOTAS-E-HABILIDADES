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
  Divider,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  School,
  LockOutlined,
  PersonOutline,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    tipoUsuario: 'admin'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [schoolSettings, setSchoolSettings] = useState(null);

  useEffect(() => {
    loadSchoolSettings();
  }, []);

  const loadSchoolSettings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/settings');
      setSchoolSettings(response.data);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.senha);
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/configuracoes?tab=senha');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) => 
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Botão de Tema */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <Tooltip title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}>
          <IconButton 
            onClick={toggleTheme} 
            sx={{ 
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Elementos decorativos */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: (theme) => 
            theme.palette.mode === 'dark'
              ? 'rgba(0, 188, 212, 0.1)'
              : 'rgba(255, 255, 255, 0.1)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: (theme) => 
            theme.palette.mode === 'dark'
              ? 'rgba(0, 188, 212, 0.05)'
              : 'rgba(255, 255, 255, 0.05)',
        }}
      />

      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: (theme) => 
              theme.palette.mode === 'dark'
                ? 'rgba(30, 30, 30, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Logo e Nome da Escola */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            {schoolSettings?.logo ? (
              <Avatar
                key={schoolSettings.logo}
                src={schoolSettings.logo}
                alt="Logo da Escola"
                imgProps={{ 
                  onError: (e) => {
                    console.error('Erro ao carregar logo no login');
                    e.target.style.display = 'none';
                  }
                }}
                sx={{ width: 80, height: 80, mb: 2 }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mb: 2,
                  bgcolor: 'primary.main',
                }}
              >
                <School sx={{ fontSize: 50 }} />
              </Avatar>
            )}
            
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: (theme) => 
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #00bcd4 30%, #00e5ff 90%)'
                    : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
              }}
            >
              {schoolSettings?.nomeEscola || 'Sistema de Gestão Escolar'}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Faça login para acessar o sistema
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Tipo de Usuário */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tipo de Usuário</InputLabel>
              <Select
                value={formData.tipoUsuario}
                label="Tipo de Usuário"
                onChange={(e) => setFormData({ ...formData, tipoUsuario: e.target.value })}
              >
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="coordenador">Coordenador</MenuItem>
                <MenuItem value="professor">Professor</MenuItem>
                <MenuItem value="aluno">Aluno</MenuItem>
                <MenuItem value="responsavel">Responsável</MenuItem>
              </Select>
            </FormControl>

            {/* Email */}
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline />
                  </InputAdornment>
                ),
              }}
            />

            {/* Senha */}
            <TextField
              fullWidth
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              required
              sx={{ mb: 2 }}
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

            {/* Link Esqueci a Senha */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={handleForgotPassword}
                sx={{ textDecoration: 'none' }}
              >
                Esqueceu a senha?
              </Link>
            </Box>

            {/* Botão de Login */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                background: (theme) => 
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #00bcd4 30%, #00e5ff 90%)'
                    : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                '&:hover': {
                  background: (theme) => 
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #00acc1 30%, #00d4e5 90%)'
                      : 'linear-gradient(45deg, #5568d3 30%, #6b3fa0 90%)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
            </Button>
          </form>

          {/* Link de Cadastro */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Não tem uma conta?{' '}
              <Link
                component={RouterLink}
                to="/register"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Cadastre-se
              </Link>
            </Typography>
          </Box>

          {/* Informações Adicionais */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              © {new Date().getFullYear()} {schoolSettings?.nomeEscola || 'Sistema de Gestão Escolar'}. Todos os direitos reservados.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
