import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import { Outlet } from 'react-router-dom';
import { AppHeader } from 'components/AppHeader';
import { SideMenu, MobileMenu } from '../components/Menu';
// import { StickyFooter } from '../components/StickyFooter';

export function Layout() {
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
    <>
      <AppHeader />
      <Stack direction='row' spacing={1}>
        <SideMenu />
        <Stack direction='column' width='100%' p={2}>
          <Outlet />
        </Stack>
      </Stack>
    </>
  );
}
