import AppBar from '@mui/material/AppBar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Stack from '@mui/system/Stack';
import { useAppSelector } from '../shared/useAppSelector';
import { useAppDispatch } from '../shared/useAppDispatch';
import { setFullWidth, setSmallWidth, setMobileMenuAnchorEl } from '../store/menuSlice';

export function AppHeader() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const title = useAppSelector((state) => state.menuReducer.title);
  const width = useAppSelector((state) => state.menuReducer.width);
  const dispatch = useAppDispatch();

  const MobileMenuIcon = () => <IconButton id="openMenuBtn" onClick={(event) => dispatch(setMobileMenuAnchorEl(event.currentTarget.id))} size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
      <MenuIcon />
    </IconButton>;

  const DesktopMenuIcon = () => <Stack width={width} alignItems={width === 200 ? 'end' : 'start'}>
    <IconButton onClick={ () => { dispatch(width === 200 ? setSmallWidth() : setFullWidth()); }} >
      {width === 200 ? <ArrowBackIosIcon fontSize='large' htmlColor='#fff' /> : <ArrowForwardIosIcon fontSize='large' htmlColor='#fff' />}
    </IconButton>
  </Stack>;

  return (
    <AppBar position="static">
      <Toolbar>
          {isMobile && <MobileMenuIcon />}
          {!isMobile && <DesktopMenuIcon />}
        <Typography variant="h6" noWrap component="div">
          { title }
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
