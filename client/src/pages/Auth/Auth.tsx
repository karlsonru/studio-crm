import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PasswordField } from '../../shared/components/fields/PasswordField';
import { SubmitButton } from '../../shared/components/buttons/SubmitButton';

const theme = createTheme();

export default function AuthPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="login"
                  label="Логин"
                  name="login"
                  autoComplete="login"
                />
              </Grid>
              <Grid item xs={12}>
                <PasswordField
                  name="password"
                  props={{
                    id: 'password',
                    type: 'password',
                    label: 'Пароль',
                    required: true,
                    fullWidth: true,
                  }}
                />
              </Grid>
            </Grid>
            <SubmitButton
              content='Войти'
              props={{
                fullWidth: true,
                sx: { mt: 3, mb: 2 },
              }}
            />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
