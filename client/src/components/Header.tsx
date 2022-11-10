import React from 'react';
import AppBar from '@mui/material/AppBar';
import {
  CssBaseline, Toolbar, IconButton, Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export function Header({ width }: { width: string }) {
  return (
    <AppBar sx={{
      width,
    }}>
      <CssBaseline />
      <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Mini variant drawer
          </Typography>
        </Toolbar>
    </AppBar>
  );
}
