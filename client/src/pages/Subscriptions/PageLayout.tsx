import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { setPageTitle } from '../../shared/reducers/appMenuSlice';

export function SubscriptionsPageLayout() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [value, setValue] = useState(location.pathname.includes('templates') ? 1 : 0);

  useEffect(() => {
    dispatch(setPageTitle('Абонементы'));
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Абонементы" component={NavLink} to="/subscriptions" />
        <Tab label="Шаблоны" component={NavLink} to="./templates" />
      </Tabs>
      <Outlet />
    </>
  );
}
