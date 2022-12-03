import { Box } from '@mui/system';

export function TimeColumn() {
  const time = ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'];

  return (
    <Box sx={{
      padding: '4px',
      marginTop: '44px',
    }}>
      { time.map((hh) => <Box key={hh} sx={{ height: '120px' }}>{hh}:00</Box>) }
    </Box>
  );
}
