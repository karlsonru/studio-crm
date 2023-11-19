import { ReactNode, useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/material/Tabs';
import Tab, { TabProps } from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import Stack from '@mui/material/Stack';

interface ITabContent {
  value: string;
  label: string | ReactNode;
  tabProps?: TabProps;
  content: Array<ReactNode> | ReactNode;
  conditionally?: ReactNode;
}

interface ITabsWrapper {
  defaultTab: string;
  tabsContent: Array<ITabContent>;
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
              <Tab key={tab.value} label={tab.label} value={tab.value} {...tab.tabProps} />
          )) }
        </Tabs>
        {tabsContent.map((tab) => (
          tab.value === value && tab.conditionally
        ))}
      </Stack>

      { tabsContent.map((tab) => (
        <TabPanel key={tab.value} value={tab.value}>
            {tab.content}
        </TabPanel>
      )) }

    </TabContext>
  );
}
