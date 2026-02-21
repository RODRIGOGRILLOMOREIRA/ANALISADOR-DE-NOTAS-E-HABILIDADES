import { createTheme } from '@mui/material/styles';

// Cores principais
const cyanGreen = {
  main: '#00CED1',      // Verde ciano principal
  light: '#4FD9DC',     // Verde ciano claro
  dark: '#008B8B',      // Verde ciano escuro
  contrastText: '#000', // Texto em contraste
};

const darkColors = {
  primary: '#00CED1',
  secondary: '#00FFFF',
  background: '#0A0E14',
  paper: '#151A23',
  text: '#E6E8EA',
};

const lightColors = {
  primary: '#008B8B',
  secondary: '#00CED1',
  background: '#BDBDBD',
  paper: '#FFFFFF',
  text: '#1A1A1A',
};

// Tema Escuro
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: darkColors.primary,
      light: '#4FD9DC',
      dark: '#007B7F',
      contrastText: '#000000',
    },
    secondary: {
      main: darkColors.secondary,
      light: '#66FFFF',
      dark: '#00CCCC',
      contrastText: '#000000',
    },
    background: {
      default: darkColors.background,
      paper: darkColors.paper,
    },
    text: {
      primary: darkColors.text,
      secondary: darkColors.primary,
    },
    divider: 'rgba(0, 206, 209, 0.12)',
    action: {
      active: darkColors.primary,
      hover: 'rgba(0, 206, 209, 0.08)',
      selected: 'rgba(0, 206, 209, 0.16)',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Roboto", sans-serif',
    h1: { 
      color: darkColors.primary,
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h2: { 
      color: darkColors.primary,
      fontWeight: 700,
      letterSpacing: '-0.3px',
    },
    h3: { 
      color: darkColors.primary,
      fontWeight: 600,
      letterSpacing: '-0.2px',
    },
    h4: { 
      color: darkColors.primary,
      fontWeight: 600,
    },
    h5: { 
      color: darkColors.primary,
      fontWeight: 600,
    },
    h6: { 
      color: darkColors.primary,
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Inter", "Roboto", sans-serif',
    },
    body2: {
      fontFamily: '"Inter", "Roboto", sans-serif',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          color: darkColors.primary,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#000000',
          borderRight: `1px solid ${darkColors.primary}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0 4px 12px rgba(0, 206, 209, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0, 206, 209, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid rgba(0, 206, 209, 0.2)`,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: darkColors.primary,
            borderRadius: '4px',
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          minWidth: '650px',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 206, 209, 0.1)',
          '& .MuiTableCell-head': {
            color: darkColors.primary,
            fontWeight: 700,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 206, 209, 0.05)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderColor: darkColors.primary,
        },
      },
    },
  },
});

// Tema Claro
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: lightColors.primary,
      light: '#339999',
      dark: '#006666',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: lightColors.secondary,
      light: '#4FD9DC',
      dark: '#007B7F',
      contrastText: '#FFFFFF',
    },
    background: {
      default: lightColors.background, // Cinza mais escuro para o fundo
      paper: lightColors.paper, // Branco para caixas e tabelas
    },
    text: {
      primary: lightColors.text,
      secondary: lightColors.primary,
    },
    divider: 'rgba(0, 139, 139, 0.12)',
    action: {
      active: lightColors.primary,
      hover: 'rgba(0, 139, 139, 0.08)',
      selected: 'rgba(0, 139, 139, 0.16)',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Roboto", sans-serif',
    h1: { 
      color: lightColors.primary,
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h2: { 
      color: lightColors.primary,
      fontWeight: 700,
      letterSpacing: '-0.3px',
    },
    h3: { 
      color: lightColors.primary,
      fontWeight: 600,
      letterSpacing: '-0.2px',
    },
    h4: { 
      color: lightColors.primary,
      fontWeight: 600,
    },
    h5: { 
      color: lightColors.primary,
      fontWeight: 600,
    },
    h6: { 
      color: lightColors.primary,
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Inter", "Roboto", sans-serif',
    },
    body2: {
      fontFamily: '"Inter", "Roboto", sans-serif',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: lightColors.primary,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: `1px solid ${lightColors.primary}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0 4px 12px rgba(0, 139, 139, 0.2)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0, 139, 139, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid rgba(0, 139, 139, 0.2)`,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: lightColors.primary,
            borderRadius: '4px',
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          minWidth: '650px',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            paddingLeft: '8px',
            paddingRight: '8px',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 139, 139, 0.08)',
          '& .MuiTableCell-head': {
            color: lightColors.primary,
            fontWeight: 700,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 139, 139, 0.04)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderColor: lightColors.primary,
        },
      },
    },
  },
});
