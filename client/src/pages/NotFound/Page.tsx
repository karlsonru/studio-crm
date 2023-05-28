import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import notFoundPageBackground from '../../assets/images/notFoundPageBackground.webp';
import { MODAL_FORM_WIDTH } from '../../shared/constants';
import { useMobile } from '../../shared/hooks/useMobile';

export function NotFoundPage() {
  const isMobile = useMobile();
  const navigate = useNavigate();

  return (
    <Paper sx={{
      width: '100%',
      height: '98vh',
      overflow: 'hidden',

      backgroundImage: `url(${notFoundPageBackground})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right',
      backgroundSize: 'contain',

      display: isMobile ? 'block' : 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>

      <Card sx={{
        maxWidth: MODAL_FORM_WIDTH,
        backgroundColor: 'transparent',
      }}>
        <CardHeader
          title="404"
          titleTypographyProps={{
            color: 'red',
            textAlign: 'center',
          }}
        />

        <CardContent>
          <Typography
            variant='h5'
            textAlign='center'
          >
            Страница не найдена
          </Typography>
        </CardContent>

        <CardActions>
          <Button
            variant='contained'
            onClick={() => navigate('/')}
            sx={{
              margin: '0 auto',
            }}
          >
              На главную
          </Button>
        </CardActions>
      </Card>

    </Paper>
  );
}
