import { ThemeProvider } from '@mui/material/styles';
import { defaultTheme } from './shared/theme';
import { Router } from './Router';

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Router />
    </ThemeProvider>
  );
}

export default App;
