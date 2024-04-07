import Stack, { StackProps } from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface IConternCardItem {
  title: string;
  value: string | number | React.ReactNode;
  props?: StackProps;
}

export function CardContentItem({ title, value, props }: IConternCardItem) {
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
