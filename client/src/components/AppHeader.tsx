import React from 'react';
import AppBar from '@mui/material/AppBar';
import { Toolbar, Typography } from '@mui/material';

export function AppHeader() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          { document.title }
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
