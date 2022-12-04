import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
        root: { color: 'white' },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          background: '#282828',
          borderRadius: 8,
          color: 'rgb(255, 255, 255, 0.65)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: '#282828',
          color: 'rgb(255, 255, 255, 0.9)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: 'rgb(255, 255, 255, 0.9)',
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#3b6ded',
    },
    text: {
      main: 'rgb(255,255,255)',
      primary: 'rgb(255, 255, 255)',
      secondary: 'rgba(255,255,255,0.5)',
    },
    darkCustom: {
      main: '#313131',
      contrastText: 'rgba(255, 255, 255, 0.65)',
    },
    darkButton: {
      main: '#202020',
      light: '#353535',
      contrastText: 'rgba(255, 255, 255, 0.65)',
      dark: '#191919',
    },
    whiteButton: {
      main: '#eee',
      light: '#fff',
      contrastText: 'rgba(255, 255, 255, 0.65)',
      dark: '#ddd',
    },
    textSecondary: {
      main: 'rgba(255,255,255,0.5)',
    },
  },
});
