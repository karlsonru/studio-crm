import { ReactNode, useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import Stack from '@mui/material/Stack';

interface ITabsWrapper {
  defaultTab: string;
  tabsContent: [
    {
      value: string;
      label: string;
      conditionally?: ReactNode;
      childrens: Array<ReactNode> | ReactNode;
    },
  ]
}

export function TabsWrapper({
  defaultTab, tabsContent,
}: ITabsWrapper) {
  const [value, setValue] = useState(defaultTab);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" paddingX={3}>
        <Tabs value={value} onChange={handleChange} sx={{ marginBottom: '1rem' }}>
          { tabsContent.map((tab) => (
            <Tab label={tab.label} value={tab.value} />
          )) }
        </Tabs>
        { tabsContent.map((tab) => (
          tab.value === value && tab.conditionally
        ))
        }
      </Stack>
      { tabsContent.map((tab) => (
        <TabPanel value={tab.value}>
            {tab.childrens}
        </TabPanel>
      )) }
    </TabContext>
  );
}
