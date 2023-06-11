import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useLoginMutation } from '../../shared/api';
import { useMobile } from '../../shared/hooks/useMobile';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { authActions } from '../../shared/reducers/authSlice';
import { PasswordField } from '../../shared/components/fields/PasswordField';
import { SubmitButton } from '../../shared/components/buttons/SubmitButton';
import { FormContentColumn } from '../../shared/components/FormContentColumn';

export default function AuthPage() {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const actions = useActionCreators(authActions);
  const [hasError, setError] = useState(false);

  const [login, {
    data: responseLogin, isSuccess, isError, error, isLoading,
  }] = useLoginMutation();

  useEffect(() => {
    if (isSuccess && responseLogin?.payload.token) {
      actions.setToken(responseLogin?.payload.token);

      navigate('/');
    }

    if (isError) {
      console.error(error);
      setError(true);
    }
  }, [isSuccess, isError]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setError(false);

    event.preventDefault();
    const data = new FormData(event.currentTarget);

    console.log({
      login: data.get('login'),
      password: data.get('password'),
    });

    login({
      login: data.get('login') as string,
      password: data.get('password') as string,
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            mt: 3,
            width: isMobile ? '100%' : 'auto',
          }}
        >
          <FormContentColumn>
            <TextField
              required
              fullWidth
              id="login"
              label="Логин"
              name="login"
              autoComplete="login"
            />
            <PasswordField
              name="password"
              props={{
                label: 'Пароль',
                required: true,
                fullWidth: true,
              }}
            />
            {hasError && <FormHelperText error>
              Не удалось. Проверьте правильность и попробуйте ещё раз.
            </FormHelperText>
            }
            <SubmitButton
              content='Войти'
              props={{
                disabled: isLoading,
                fullWidth: true,
                sx: { mt: 3, mb: 2 },
              }}
            />
          </FormContentColumn>
        </Box>
      </Box>
    </Container>
  );
}
