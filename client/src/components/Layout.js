import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  School,
  Class,
  People,
  Person,
  Assessment,
  Assignment,
  BarChart,
  Logout,
  Home as HomeIcon,
  Brightness4,
  Brightness7,
  Summarize,
  EventNote,
  Settings,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { useSchool } from '../context/SchoolContext';

const drawerWidth = 240;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { schoolSettings, refreshKey } = useSchool();

  // Debug: Log quando schoolSettings mudar
  React.useEffect(() => {
    console.log('Layout - SchoolSettings atualizadas:', schoolSettings);
    console.log('RefreshKey:', refreshKey);
  }, [schoolSettings, refreshKey]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Início', icon: <HomeIcon />, path: '/' },
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Professores', icon: <School />, path: '/professores' },
    { text: 'Disciplinas', icon: <Class />, path: '/disciplinas' },
    { text: 'Turmas', icon: <People />, path: '/turmas' },
    { text: 'Alunos', icon: <Person />, path: '/alunos' },
    { text: 'Avaliações', icon: <Assessment />, path: '/avaliacoes' },
    { text: 'Habilidades', icon: <Assignment />, path: '/habilidades' },
    { text: 'Frequências', icon: <EventNote />, path: '/frequencias' },
    { text: 'Relatórios', icon: <Summarize />, path: '/relatorios' },
    { text: 'Configurações', icon: <Settings />, path: '/configuracoes' },
  ];

  const drawer = (
    <div>
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
        {schoolSettings?.logo ? (
          <Avatar
            key={`drawer-logo-${refreshKey}`}
            src={schoolSettings.logo}
            alt="Logo da Escola"
            imgProps={{ 
              onError: (e) => {
                console.error('Erro ao carregar logo no drawer');
                e.target.style.display = 'none';
              },
              onLoad: () => {
                console.log('Logo carregada no drawer com sucesso');
              }
            }}
            sx={{ 
              width: 80, 
              height: 80,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          />
        ) : (
          <Avatar sx={{ 
            width: 80, 
            height: 80, 
            bgcolor: 'primary.main',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}>
            <School sx={{ fontSize: 48 }} />
          </Avatar>
        )}
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0A0E14 0%, #1a2332 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {schoolSettings?.logo && (
              <Avatar
                key={`appbar-logo-${refreshKey}`}
                src={schoolSettings.logo}
                alt="Logo da Escola"
                imgProps={{ 
                  onError: (e) => {
                    console.error('Erro ao carregar logo no appbar');
                    e.target.style.display = 'none';
                  }
                }}
                sx={{ width: 40, height: 40, mr: 2 }}
              />
            )}
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontFamily: '"Poppins", "Roboto", sans-serif',
                fontWeight: 700,
                letterSpacing: '0.5px',
                textAlign: 'center',
              }}
            >
              {schoolSettings?.nomeEscola || 'Sistema de Gerenciamento Escolar'}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.nome} ({user?.tipo})
          </Typography>
          <Tooltip title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}>
            <IconButton onClick={toggleTheme} color="inherit">
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
