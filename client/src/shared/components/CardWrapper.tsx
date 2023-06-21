import { ReactNode } from 'react';
import Card from '@mui/material/Card';
import { useMobile } from '../hooks/useMobile';

export function CardWrapper({ children }: { children: ReactNode | Array<ReactNode> }) {
  const isMobile = useMobile();

  return (
    <Card
      variant="outlined"
      sx={{
        width: isMobile ? 'auto' : '325px',
        marginRight: isMobile ? 0 : '0.5rem',
        marginBottom: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      { children }
    </Card>
  );
}
