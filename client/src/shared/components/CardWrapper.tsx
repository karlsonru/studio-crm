import { ReactNode } from 'react';
import Card, { CardProps } from '@mui/material/Card';
import { SxProps, Theme } from '@mui/material/styles';
import { useMobile } from '../hooks/useMobile';

interface ICardWrapper {
  children: ReactNode | Array<ReactNode>;
  props?: CardProps;
  extraStyle?: SxProps<Theme>;
}

const basicStyle = {
  marginBottom: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
} as const;

export function CardWrapper({ children, props, extraStyle }: ICardWrapper) {
  const isMobile = useMobile();

  return (
    <Card
      variant="outlined"
      sx={{
        width: isMobile ? 'auto' : '325px',
        marginRight: isMobile ? 0 : '0.5rem',
        ...basicStyle,
        ...extraStyle,
      }}
      {...props}
    >
      { children }
    </Card>
  );
}
