import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Fade,
  Zoom,
} from '@mui/material';
import {
  School,
  Class,
  People,
  Assessment,
  Assignment,
  BarChart,
  EventNote,
  Summarize,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const cards = [
    { 
      title: 'Dashboard', 
      icon: <DashboardIcon sx={{ fontSize: 48 }} />, 
      path: '/dashboard', 
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      description: 'Visão geral e estatísticas'
    },
    { 
      title: 'Professores', 
      icon: <School sx={{ fontSize: 48 }} />, 
      path: '/professores', 
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      description: 'Gerenciar professores'
    },
    { 
      title: 'Disciplinas', 
      icon: <Class sx={{ fontSize: 48 }} />, 
      path: '/disciplinas', 
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      description: 'Cadastro de disciplinas'
    },
    { 
      title: 'Turmas', 
      icon: <People sx={{ fontSize: 48 }} />, 
      path: '/turmas', 
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      description: 'Organizar turmas'
    },
    { 
      title: 'Alunos', 
      icon: <People sx={{ fontSize: 48 }} />, 
      path: '/alunos', 
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      description: 'Cadastro de alunos'
    },
    { 
      title: 'Avaliações', 
      icon: <Assessment sx={{ fontSize: 48 }} />, 
      path: '/avaliacoes', 
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      description: 'Lançar notas e avaliações'
    },
    { 
      title: 'Habilidades', 
      icon: <Assignment sx={{ fontSize: 48 }} />, 
      path: '/habilidades', 
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      description: 'Acompanhar habilidades'
    },
    { 
      title: 'Frequências', 
      icon: <EventNote sx={{ fontSize: 48 }} />, 
      path: '/frequencias', 
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      description: 'Controle de presença'
    },
    { 
      title: 'Relatórios', 
      icon: <Summarize sx={{ fontSize: 48 }} />, 
      path: '/relatorios', 
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      description: 'Gerar relatórios'
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box 
          sx={{ 
            mb: 6, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(0, 206, 209, 0.1) 0%, rgba(0, 139, 139, 0.05) 100%)',
            borderRadius: 4,
            p: 4,
            boxShadow: '0 4px 20px rgba(0, 206, 209, 0.15)',
          }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #00CED1 0%, #008B8B 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Bem-vindo, {user?.nome}! 
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            Sistema de Gerenciamento Escolar 
          </Typography>
        </Box>
      </Fade>

      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Zoom in={true} timeout={300 + index * 100}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  background: card.gradient,
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 12px 30px rgba(0, 206, 209, 0.4)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => navigate(card.path)}
                  sx={{ height: '100%', position: 'relative', zIndex: 1 }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center', color: 'white' }}>
                    <Box 
                      sx={{ 
                        mb: 2,
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      gutterBottom
                      sx={{ fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                    >
                      {card.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.9,
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)' 
                      }}
                    >
                      {card.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      <Fade in={true} timeout={1200}>
        <Box sx={{ mt: 6 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(0, 206, 209, 0.08) 0%, rgba(0, 139, 139, 0.04) 100%)',
              border: '2px solid rgba(0, 206, 209, 0.2)',
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: '#00CED1',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <BarChart /> Funcionalidades do Sistema
            </Typography>
            <Grid container spacing={2}>
              {[
                'Cadastro completo de professores, disciplinas, turmas e alunos',
                'Lançamento de avaliações com cálculo automático de notas trimestrais',
                'Cálculo automático da média anual (3 trimestres)',
                'Gestão de habilidades desenvolvidas por trimestre',
                'Controle de frequência diário com visualização em tempo real',
                'Dashboards analíticos com filtros personalizáveis',
                'Visualização de alunos em risco de reprovação',
                'Análise de evolução trimestral e desempenho por disciplina',
                'Sistema de autenticação com diferentes níveis de acesso',
                'Configurações personalizadas da escola com upload de logo',
              ].map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      gap: 1.5,
                      p: 2,
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(0, 206, 209, 0.1)',
                        transform: 'translateX(8px)',
                      }
                    }}
                  >
                    <Box
                      sx={{
                        minWidth: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #00CED1 0%, #008B8B 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        mt: 0.3,
                      }}
                    >
                      ✓
                    </Box>
                    <Typography variant="body1" sx={{ flex: 1 }}>
                      {item}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default Home;
