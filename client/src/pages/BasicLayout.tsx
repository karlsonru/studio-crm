import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import { Outlet, Navigate } from 'react-router-dom';
import { AppHeader } from '../shared/components/AppHeader';
import { useLocalStorage } from '../shared/hooks/useLocalStorage';
import {
  SideMenu,
  MobileMenu,
  MobileMenuIcon,
  DesktopMenuIcon,
} from '../shared/components/Menu';
// import { StickyFooter } from '../components/StickyFooter';

export function Layout() {
  const isMobile = useMediaQuery('(max-width: 767px)');

  return (
    <>
      <AppHeader menuIcon={isMobile ? <MobileMenuIcon /> : <DesktopMenuIcon />} />
      <Stack direction={isMobile ? 'column' : 'row'} spacing={1} >
        {isMobile && <MobileMenu />}
        {!isMobile && <SideMenu />}
        <Stack direction='column' p={isMobile ? 1 : 2} overflow='hidden' width={isMobile ? 'auto' : '100%'}>
          <Outlet />
        </Stack>
      </Stack>
    </>
  );
}

export function ProtectedLayout() {
  const { getItem } = useLocalStorage();
  const token = getItem('token');

  if (!token) {
    return <Navigate to='/auth' replace={true} />;
  }

  return <Layout />;
}
