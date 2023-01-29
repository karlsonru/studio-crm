import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useEffect, useState } from 'react';
import { SubscribtionsTemplatesHeader } from './Templates/PageHeader';
import { SubscribtionsTemplatesContent } from './Templates/Content';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { setPageTitle } from '../../shared/reducers/appMenuSlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && children}
    </div>
  );
}

export function SubscribtionsPage() {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState(0);

  useEffect(() => {
    dispatch(setPageTitle('Абонементы'));
  }, []);

  return (
    <>
    <Tabs value={value} onChange={(e, val) => setValue(val)} sx={{ mb: 2 }}>
      <Tab label='Шаблоны' id="templates" />
      <Tab label='Абонементы' id="subscribtions" />
    </Tabs>
    <TabPanel value={value} index={0} >
      <SubscribtionsTemplatesHeader />
      <SubscribtionsTemplatesContent />
    </TabPanel>
    <TabPanel value={value} index={1} >
    </TabPanel>
    </>
  );
}
