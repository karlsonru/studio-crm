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
    MuiCard: {
      styleOverrides: {
        root: {
          margin: '8px 0px',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '0px 4px',
          '&:last-child': {
            paddingBottom: '4px',
          },
        },
      },
    },
  },
});

export { defaultTheme };
