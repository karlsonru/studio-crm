import { ThemeProvider } from '@mui/material/styles';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import store from './shared/store';
import { defaultTheme } from './shared/theme';
import { router } from './Router';

function App() {
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
        <ThemeProvider theme={defaultTheme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </LocalizationProvider>
    </Provider>
  );
}

export default App;
