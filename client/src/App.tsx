import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import store from './shared/store';
import { defaultTheme } from './shared/theme';
import { Router } from './Router';

function App() {
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
        <ThemeProvider theme={defaultTheme}>
          <Router />
        </ThemeProvider>
      </LocalizationProvider>
    </Provider>
  );
}

export default App;
