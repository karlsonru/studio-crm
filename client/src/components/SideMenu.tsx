import React, { ReactNode, useState } from "react";
import { MenuList, Divider, Drawer, ListItemIcon, MenuItem, Typography } from "@mui/material";
import WidgetsIcon from '@mui/icons-material/Widgets';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';
import { NavLink } from "react-router-dom";

interface IMenuItem {
  icon: ReactNode;
  title: string;
  path: string;
}

const AddMenuItem = ({ icon, title, path}: IMenuItem) => {
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
      <MenuItem sx={{
        background: 'inherit',
      }}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <Typography variant="subtitle1" noWrap>
          {title}
        </Typography>
      </MenuItem>
    </NavLink>
  )
}

export function SideMenu() {
  const [isFullWidth, setFullWidth] = useState(200);

  const hideMenuHandler = () => {
    setFullWidth(isFullWidth === 200 ? 55 : 200); 
  }

  return (
    <Drawer anchor="left" variant="permanent">
      <MenuList sx={{width: `${isFullWidth}px!important`}}>
        <AddMenuItem icon={<WidgetsIcon onClick={hideMenuHandler} />} title='Меню' path="/index" />
        <Divider />
        <AddMenuItem icon={<CalendarMonthIcon />} title='Расписание' path="/timetable" />
        <AddMenuItem icon={<GroupIcon />} title='Ученики' path="/students" />
        <AddMenuItem icon={<ListAltIcon />} title='Занятия' path="/lessons" />
        <AddMenuItem icon={<CardMembershipIcon />} title='Абонементы' path="/subscribtions" />
        <AddMenuItem icon={<CurrencyRubleIcon />} title='Финансы' path="/finance" />
      </MenuList>

    </Drawer>
  )
}
