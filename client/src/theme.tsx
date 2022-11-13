import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const defaultTheme = createTheme(theme, {
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '8px',
          textAlign: 'left',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          height: '60px',
        },
      },
    },
  },
});

export { defaultTheme };
