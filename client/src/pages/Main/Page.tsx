import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useTitle } from '../../shared/hooks/useTitle';
import mainPageLogo from '../../assets/images/mainPageLogo.png';

function GoToButton({ route, label }: { route: string, label: string }) {
  const navigate = useNavigate();
  return <Button
    variant='outlined'
    size='large'
    onClick={() => navigate(route)}
    sx={{
      marginY: '1rem',
      width: '100%',
      fontSize: '1.2rem',
    }}
  >
    {label}
  </Button>;
}

export function MainPage() {
  useTitle('Главная');

  return (
    <>
      <Paper sx={{
        width: '100%',
        minHeight: '50vh',

        backgroundImage: `url(${mainPageLogo})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right',
        backgroundSize: 'cover',
      }}
      >
      </Paper>

    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <GoToButton route='/attendancespostponed' label='Отработки' />
      </Grid>

      <Grid item xs={12} sm={6}>
        <GoToButton route='/subscriptions' label='Истекающие абонементы' />
      </Grid>
    </Grid>

    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <GoToButton route='/fake' label='Неоплаченные посещения' />
      </Grid>

      <Grid item xs={12} sm={6}>
        <GoToButton route='/' label='Свободно' />
      </Grid>
    </Grid>
    </>
  );
}
