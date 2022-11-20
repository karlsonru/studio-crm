import { ReactNode, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Menu, MenuList, ListItemIcon, MenuItem, Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';

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

export function MobileMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
    <button onClick={handleClick} style={{
      background: 'transparent',
      border: 'solid lightgrey',
      borderWidth: '0px thin',
    }}>
      <MenuIcon />
    </button>
    <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
      <MenuList>
        { MenuItemsList.map(
          (elem) => <NavItem
              key={elem.path}
              path={elem.path}
              menuItem={ <AddMenuItem icon={elem.icon} title={elem.title} /> }
            />,
        )}
      </MenuList>
    </Menu>
    </>
  );
}
