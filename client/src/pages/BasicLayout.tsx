import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import { Outlet } from 'react-router-dom';
import { AppHeader } from 'shared/components/AppHeader';
import {
  SideMenu,
  MobileMenu,
  MobileMenuIcon,
  DesktopMenuIcon,
} from '../shared/components/Menu';
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
        <Stack direction='column' width='100%' p={isMobile ? 1 : 2} overflow='hidden'>
          <Outlet />
        </Stack>
      </Stack>
    </>
  );
}
