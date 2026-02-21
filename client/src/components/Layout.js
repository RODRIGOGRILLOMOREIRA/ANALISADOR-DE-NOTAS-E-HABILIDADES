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
  useTheme as useMuiTheme,
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
  const muiTheme = useMuiTheme();

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
    <Box 
      sx={{ 
        height: '100%',
        backgroundColor: muiTheme.palette.mode === 'dark' ? '#000000' : '#FFFFFF',
      }}
    >
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
            <ListItemButton 
              onClick={() => navigate(item.path)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 188, 212, 0.08)',
                }
              }}
            >
              <ListItemIcon sx={{ color: '#00bcd4' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontFamily: '"Poppins", "Roboto", sans-serif',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: '#00bcd4',
                  letterSpacing: '0.3px',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleLogout}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 188, 212, 0.08)',
              }
            }}
          >
            <ListItemIcon sx={{ color: '#00bcd4' }}>
              <Logout />
            </ListItemIcon>
            <ListItemText 
              primary="Sair"
              primaryTypographyProps={{
                fontFamily: '"Poppins", "Roboto", sans-serif',
                fontWeight: 500,
                fontSize: '0.95rem',
                color: '#00bcd4',
                letterSpacing: '0.3px',
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0A0E14 0%, #1a2332 100%)'
            : '#ffffff',
          boxShadow: (theme) => theme.palette.mode === 'dark'
            ? '0 2px 8px rgba(0, 0, 0, 0.3)'
            : '0 2px 12px rgba(0, 0, 0, 0.08)',
          borderBottom: (theme) => theme.palette.mode === 'dark'
            ? 'none'
            : '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              color: (theme) => theme.palette.mode === 'dark'
                ? '#ffffff'
                : '#1a1a1a',
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Typography 
            variant="body1" 
            sx={{ 
              mr: 2,
              fontFamily: '"Poppins", "Roboto", sans-serif',
              fontWeight: 500,
              fontSize: '0.95rem',
              color: (theme) => theme.palette.mode === 'dark'
                ? '#ffffff'
                : '#1a1a1a',
              letterSpacing: '0.3px',
            }}
          >
            {user?.nome} ({user?.tipo})
          </Typography>
          <Tooltip title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}>
            <IconButton 
              onClick={toggleTheme} 
              sx={{
                color: (theme) => theme.palette.mode === 'dark'
                  ? '#ffffff'
                  : '#1a1a1a',
              }}
            >
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
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: (theme) => theme.palette.mode === 'dark' 
                ? '#000000' 
                : '#FFFFFF',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: (theme) => theme.palette.mode === 'dark' 
                ? '#000000' 
                : '#FFFFFF',
            },
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
          p: { xs: 1, sm: 2, md: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
