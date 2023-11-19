import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTitle } from '../../shared/hooks/useTitle';

export function SubscriptionsPageLayout() {
  useTitle('Абонементы');
  const location = useLocation();
  const [value, setValue] = useState(location.pathname.includes('templates') ? 1 : 0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange} sx={{ marginBottom: '1rem' }}>
        <Tab label="Абонементы" component={NavLink} to="/subscriptions" />
        <Tab label="Шаблоны" component={NavLink} to="/subscriptions/templates" />
      </Tabs>
      <Outlet />
    </>
  );
}
