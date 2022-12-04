import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';
import { useAppSelector } from '../shared/useAppSelector';
import { useAppDispatch } from '../shared/useAppDispatch';
import { setMobileMenuAnchorEl } from '../store/menuSlice';

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
    background: '#fff000',
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
      path: 'students',
      title: 'Ученики',
      icon: <GroupIcon />,
    },
    {
      path: 'lessons',
      title: 'Занятия',
      icon: <ListAltIcon />,
    },
    {
      path: 'subscribtions',
      title: 'Абонементы',
      icon: <CardMembershipIcon />,
    },
    {
      path: 'finance',
      title: 'Финансы',
      icon: <CurrencyRubleIcon />,
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

export function SideMenu() {
  const width = useAppSelector((state) => state.menuReducer.width);

  return (
    <MenuList sx={{ width: `${width}px` }}>
      { createMenuList() }
    </MenuList>
  );
}
