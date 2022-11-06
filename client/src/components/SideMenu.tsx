import React, { ReactNode, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { MenuList, Divider, Drawer, ListItemIcon, MenuItem, Typography } from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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
  }
  
  const regularStyle = {
    color: 'inherit',
    textDecoration: 'none',
    background: 'inherit',
  }

  return (
    <NavLink to={path} style={ ({ isActive }) => isActive ? activeStyle : regularStyle} >
      {menuItem}
    </NavLink>
  )
}

const AddMenuItem = ({ icon, title }: IMenuItem) => {
  return (
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
  )
}

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
  }
];

export function SideMenu({ width, setWidthHandler }: {width: number, setWidthHandler: (width: number) => void}) {
  const [isMenuOpen, setMenuOpen] = useState(true);

  useEffect(() => {
    if (isMenuOpen) {
      setWidthHandler(200);
    } else {
      setWidthHandler(55);
    }
  }, [isMenuOpen, setWidthHandler]);

  const toggleMenuHandler = () => {
    setMenuOpen(isMenuOpen => !isMenuOpen);
  }

  const arrow = isMenuOpen ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />;

  return (
    <Drawer variant="persistent" open={true}>
      <MenuList sx={{
        width: width,
      }}>
        <MenuItem 
          onClick={toggleMenuHandler} 
          sx={{
            justifyContent: isMenuOpen ? "end" : "start",
          }}
        >
          {arrow}
        </MenuItem>
        <Divider />
        
        { MenuItemsList.map(elem => <NavItem key={elem.path} path={elem.path} menuItem={ <AddMenuItem icon={elem.icon} title={elem.title} /> } /> )}
        
      </MenuList>
    </Drawer>
  )
}
