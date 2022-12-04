import { Grid, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { AppHeader } from 'components/AppHeader';
import { SideMenu } from '../components/SideMenu';
import { MobileMenu } from '../components/MobileMenu';
// import { StickyFooter } from '../components/StickyFooter';

export function Layout() {
  const [firstColumnWidth, setFirstColumnWidth] = useState(200);
  const isMobile = useMediaQuery('(max-width: 767px)');

  if (isMobile) {
    return (
      <>
        <AppHeader />
        <MobileMenu />
        <Outlet />
      </>
    );
  }

  return (
    <Grid container columns={2} spacing={0}>
      <Grid item sx={{ width: firstColumnWidth, position: 'relative' }}>
        <SideMenu width={firstColumnWidth} setWidthHandler={setFirstColumnWidth}/>
      </Grid>
      <Grid
        container
        item
        direction='column'
        justifyContent='space-between'
        alignItems='stretch'
        p={2}
        pt={0}
        height={'100%'}
        width={`calc(100% - ${firstColumnWidth}px)`}
      >
        <AppHeader />
        <Outlet />
      </Grid>
    </Grid>
  );
}
