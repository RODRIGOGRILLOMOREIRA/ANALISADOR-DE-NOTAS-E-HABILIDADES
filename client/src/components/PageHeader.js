import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useSchool } from '../context/SchoolContext';

const PageHeader = ({ title, subtitle, icon: Icon }) => {
  const { schoolSettings, refreshKey } = useSchool();

  return (
    <Box 
      sx={{ 
        mb: 4,
        textAlign: 'center',
        position: 'relative',
      }}
    >
      {/* Nome da Escola */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 2,
          mb: 3,
          pb: 2,
          borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`,
        }}
      >
        {schoolSettings?.logo && (
          <Avatar
            key={`pageheader-logo-${refreshKey}`}
            src={schoolSettings.logo}
            alt="Logo da Escola"
            imgProps={{ 
              onError: (e) => {
                console.error('Erro ao carregar logo no PageHeader');
                e.target.style.display = 'none';
              }
            }}
            sx={{ 
              width: 56, 
              height: 56,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          />
        )}
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 700,
            letterSpacing: '0.5px',
            background: (theme) => theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #00bcd4 0%, #00ffff 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {schoolSettings?.nomeEscola || 'Sistema de Gerenciamento Escolar'}
        </Typography>
      </Box>

      {/* Título da Página */}
      {title && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          {Icon && <Icon sx={{ fontSize: 32, color: 'primary.main' }} />}
          <Typography 
            variant="h5" 
            component="h2"
            sx={{ 
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 600,
            }}
          >
            {title}
          </Typography>
        </Box>
      )}

      {/* Subtítulo */}
      {subtitle && (
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            mt: 1,
            fontFamily: '"Inter", sans-serif',
            fontWeight: 400,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default PageHeader;
