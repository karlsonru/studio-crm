import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setFullWidth, setMobileMenuAnchorEl, setSmallWidth } from '../reducers/appMenuSlice';

interface IMenuItem {
  icon: ReactNode;
  title: string;
}

interface INavItem {
  menuItem: ReactNode;
  path: string;
}

const NavItem = ({ path, menuItem }: INavItem) => {
  const activeStyle = {
    color: 'inherit',
    textDecoration: 'underline',
    background: 'lightgrey',
  };

  const regularStyle = {
    color: 'inherit',
    textDecoration: 'none',
    background: 'inherit',
  };

  return (
    <NavLink to={path} style={ ({ isActive }) => (isActive ? activeStyle : regularStyle)} >
      {menuItem}
    </NavLink>
  );
};

const AddMenuItem = ({ icon, title }: IMenuItem) => (
      <MenuItem
        sx={{
          background: 'inherit',
        }}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <Typography variant="subtitle1" noWrap>
          {title}
        </Typography>
      </MenuItem>
);

function createMenuList() {
  const MenuItemsList = [
    {
      path: 'timetable',
      title: 'Расписание',
      icon: <CalendarMonthIcon />,
    },
    {
      path: 'attendances',
      title: 'Посещения',
      icon: <DomainVerificationIcon />,
    },
    {
      path: 'lessons',
      title: 'Занятия',
      icon: <ListAltIcon />,
    },
    {
      path: 'students',
      title: 'Ученики',
      icon: <GroupIcon />,
    },
    {
      path: 'subscriptions/templates',
      title: 'Абонементы',
      icon: <CardMembershipIcon />,
    },
    {
      path: 'finance',
      title: 'Финансы',
      icon: <CurrencyRubleIcon />,
    },
    {
      path: 'users',
      title: 'Сотрудники',
      icon: <AccountBoxIcon />,
    },
  ];

  return (
    MenuItemsList.map((elem) => <NavItem
        key={elem.path}
        path={elem.path}
        menuItem={ <AddMenuItem icon={elem.icon} title={elem.title} /> }
      />)
  );
}

export function MobileMenuIcon() {
  const dispatch = useAppDispatch();

  return (
    <IconButton
      id="openMenuBtn"
      onClick={(event) => dispatch(setMobileMenuAnchorEl(event.currentTarget.id))}
      size="large"
      edge="start"
      color="inherit"
      aria-label="menu"
      sx={{ mr: 2 }}
    >
      <MenuIcon />
    </IconButton>
  );
}

export function MobileMenu() {
  const anchorEl = useAppSelector((state) => state.menuReducer.mobileMenuAnchorEl);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(setMobileMenuAnchorEl(null));
  };

  return (
    <Menu open={Boolean(anchorEl)} anchorEl={document.querySelector(`#${anchorEl}`)} onClose={handleClose}>
      <MenuList>
        { createMenuList() }
      </MenuList>
    </Menu>
  );
}

export function DesktopMenuIcon() {
  const width = useAppSelector((state) => state.menuReducer.width);
  const dispatch = useAppDispatch();

  return (
    <Stack width={width} alignItems={width === 200 ? 'end' : 'start'}>
      <IconButton onClick={ () => { dispatch(width === 200 ? setSmallWidth() : setFullWidth()); }} >
        {width === 200 ? <ArrowBackIosIcon fontSize='large' htmlColor='#fff' /> : <ArrowForwardIosIcon fontSize='large' htmlColor='#fff' />}
      </IconButton>
    </Stack>
  );
}

export function SideMenu() {
  const width = useAppSelector((state) => state.menuReducer.width);

  return (
    <MenuList sx={{ width: `${width}px` }}>
      { createMenuList() }
    </MenuList>
  );
}
