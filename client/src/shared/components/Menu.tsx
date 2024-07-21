import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
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
import MoveUpIcon from '@mui/icons-material/MoveUp';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { useMobile } from '../hooks/useMobile';
import { useAppSelector } from '../hooks/useAppSelector';
import { useActionCreators } from '../hooks/useActionCreators';
import { MenuWidth, appMenuActions } from '../reducers/appMenuSlice';

interface INavItem {
  path: string;
  title: string;
  icon: ReactNode;
}

const navItemActiveStyle = {
  color: 'inherit',
  textDecoration: 'underline',
  background: 'lightgrey',
};

const navItemRegularStyle = {
  color: 'inherit',
  textDecoration: 'none',
  background: 'inherit',
};

function NavItem({ path, title, icon }: INavItem) {
  return (
    <NavLink
      to={path}
      style={({ isActive }) => (isActive ? navItemActiveStyle : navItemRegularStyle)}
    >
      <MenuItem sx={{ background: 'inherit' }}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <Typography variant="subtitle1" noWrap>
          {title}
        </Typography>
      </MenuItem>
  </NavLink>
  );
}

function NavMenuList() {
  const isMobile = useMobile();
  const width = useAppSelector((state) => state.appMenuReducer.width);

  return (
    <MenuList sx={{ width: isMobile ? 'auto' : `${width}px` }}>
      <NavItem path="/" title="Главная" icon={<HomeIcon />} />
      <NavItem path="/timetable" title="Расписание" icon={<CalendarMonthIcon />} />
      <NavItem path="/attendances/history" title="Посещения" icon={<DomainVerificationIcon />} />
      <NavItem path="/attendances/postponed" title="Отработки" icon={<MoveUpIcon />} />
      <NavItem path="/attendances/unpaid" title="Неоплаченные" icon={<ReportGmailerrorredIcon />} />
      <NavItem path='/lessons' title="Занятия" icon={<ListAltIcon />} />
      <NavItem path='/students' title="Ученики" icon={<GroupIcon />} />
      <NavItem path='/subscriptions/templates' title="Абонементы" icon={<CardMembershipIcon />} />
      <NavItem path='/finance' title="Финансы" icon={<CurrencyRubleIcon />} />
      <NavItem path='/users' title="Сотрудники" icon={<AccountBoxIcon />} />
    </MenuList>
  );
}

export function MobileMenuIcon() {
  const actions = useActionCreators(appMenuActions);

  return (
    <IconButton
      id="openMenuBtn"
      onClick={(event) => actions.setMobileMenuAnchorEl(event.currentTarget.id)}
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
  const anchorEl = useAppSelector((state) => state.appMenuReducer.mobileMenuAnchorEl);
  const actions = useActionCreators(appMenuActions);

  const handleClose = () => {
    actions.setMobileMenuAnchorEl(null);
  };

  const isOpen = anchorEl !== null;

  return (
    <Menu open={isOpen} onClose={handleClose} anchorEl={document.querySelector(`#${anchorEl}`)}>
      <NavMenuList />
    </Menu>
  );
}

export function DesktopMenuIcon() {
  const width = useAppSelector((state) => state.appMenuReducer.width);
  const actions = useActionCreators(appMenuActions);

  const isSmallWidth = width === MenuWidth.SMALL;
  const changeWidth = () => (isSmallWidth ? actions.setFullWidth() : actions.setSmallWidth());

  return (
    <Stack width={width} alignItems={isSmallWidth ? 'start' : 'end'}>
      <IconButton onClick={changeWidth}>
        {isSmallWidth && <ArrowForwardIosIcon fontSize='large' htmlColor='#fff' />}
        {!isSmallWidth && <ArrowBackIosIcon fontSize='large' htmlColor='#fff' />}
      </IconButton>
    </Stack>
  );
}

export function SideMenu() {
  return <NavMenuList />;
}
