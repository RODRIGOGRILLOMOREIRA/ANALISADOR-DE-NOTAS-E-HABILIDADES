import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useSchool } from '../context/SchoolContext';

const PageHeader = ({ title, subtitle, icon: Icon }) => {
  const { schoolSettings, refreshKey } = useSchool();

  return (
    <Box 
      sx={{ 
        mb: { xs: 2, sm: 3, md: 4 },
        textAlign: 'center',
        position: 'relative',
        px: { xs: 1, sm: 2 },
      }}
    >
      {/* Nome da Escola */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center', 
          justifyContent: 'center',
          gap: { xs: 1, sm: 2 },
          mb: { xs: 2, sm: 3 },
          pb: { xs: 1.5, sm: 2 },
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
              width: { xs: 48, sm: 56 }, 
              height: { xs: 48, sm: 56 },
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
            fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.125rem' },
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: 0.5, sm: 1 }, flexWrap: 'wrap' }}>
          {Icon && <Icon sx={{ fontSize: { xs: 24, sm: 28, md: 32 }, color: 'primary.main' }} />}
          <Typography 
            variant="h5" 
            component="h2"
            sx={{ 
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 600,
              fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
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
            fontFamily: '"Poppins", "Roboto", sans-serif',
            fontWeight: 400,
            fontSize: { xs: '0.875rem', sm: '0.95rem' },
            letterSpacing: '0.3px',
            px: { xs: 1, sm: 0 },
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default PageHeader;
