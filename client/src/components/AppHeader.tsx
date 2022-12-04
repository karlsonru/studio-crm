import { ReactNode } from 'react';
import AppBar from '@mui/material/AppBar';
import { Toolbar, Typography } from '@mui/material';
import { useAppSelector } from '../shared/useAppSelector';

export function AppHeader({ menuIcon }: { menuIcon: ReactNode }) {
  const title = useAppSelector((state) => state.menuReducer.title);

  return (
    <AppBar position="static">
      <Toolbar>
          { menuIcon }
        <Typography variant="h6" noWrap component="div">
          { title }
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
