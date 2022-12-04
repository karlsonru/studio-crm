import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import store from './store/store';
import { defaultTheme } from './shared/theme';
import { Router } from './Router';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <Router />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
