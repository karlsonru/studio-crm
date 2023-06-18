import Stack, { StackProps } from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export function CardContentItem(
  { title, value, props }: { title: string, value: string | number, props?: StackProps },
) {
  return (
    <Stack direction="row" justifyContent="space-between" my={1} {...props}>
      <Typography>
        { title }
      </Typography>
      <Typography sx={{ fontWeight: 'bold' }}>
        { value }
      </Typography>
  </Stack>
  );
}
