import { defaultTheme } from 'theme';
import { ThemeProvider } from '@mui/material/styles';
import { Router } from './Router';

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Router />
    </ThemeProvider>
  );
}

export default App;
