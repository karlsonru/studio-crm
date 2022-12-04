import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import { Outlet } from 'react-router-dom';
import { AppHeader } from 'components/AppHeader';
import {
  SideMenu,
  MobileMenu,
  MobileMenuIcon,
  DesktopMenuIcon,
} from '../components/Menu';
// import { StickyFooter } from '../components/StickyFooter';

export function Layout() {
  const isMobile = useMediaQuery('(max-width: 767px)');

  const menu = isMobile ? <MobileMenu /> : <SideMenu />;
  const menuIcon = isMobile ? <MobileMenuIcon /> : <DesktopMenuIcon />;

  return (
    <>
      <AppHeader menuIcon={menuIcon} />
      <Stack direction={isMobile ? 'column' : 'row'} spacing={1}>
        { menu }
        <Stack direction='column' width='100%' p={1}>
          <Outlet />
        </Stack>
      </Stack>
    </>
  );
}
