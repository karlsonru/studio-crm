import { ReactNode } from 'react';
import AppBar from '@mui/material/AppBar';
import { Toolbar, Typography } from '@mui/material';
import { useAppSelector } from '../hooks/useAppSelector';

export function AppHeader({ menuIcon }: { menuIcon: ReactNode }) {
  const title = useAppSelector((state) => state.appMenuReducer.title);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#4cbb17' }}>
      <Toolbar>
          { menuIcon }
        <Typography variant="h6" noWrap component="div">
          { title }
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
