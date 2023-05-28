import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Stack from '@mui/system/Stack';

export function Loading() {
  return (
    <Stack
      justifyContent='center'
      alignItems='center'
      gap={1}
      height='100%'
      padding='1rem'
    >
      <CircularProgress />
      <Typography variant='h5'>Идёт загрузка...</Typography>
    </Stack>
  );
}
