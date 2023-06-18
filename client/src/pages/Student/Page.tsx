import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetStudentQuery } from 'shared/api';
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import Stack from '@mui/material/Stack';
import { ContentTabDetails } from './ContentTabDetails';
import { ContentTabVisits } from './ContentTabVisits';
import { SearchParamsButton } from '../../shared/components/buttons/SearchParamsButton';
import { CreateSubscriptionModal } from '../../shared/components/modals/CreateSubscriptionModal';
import { useTitle } from '../../shared/hooks/useTitle';

export function StudentPage() {
  const [value, setValue] = useState('details');

  const { studentId } = useParams();

  const { data } = useGetStudentQuery(studentId ?? '');

  useEffect(() => {
    if (!data) return;

    useTitle(data.fullname);
  }, [data]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (!studentId) return null;

  return (

    <TabContext value={value}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" paddingX={3}>
        <Tabs value={value} onChange={handleChange} sx={{ marginBottom: '1rem' }}>
          <Tab label="Детали" value="details" />
          <Tab label="Посещения" value="visits" />
        </Tabs>
        {value === 'visits' && <SearchParamsButton title="Оформить абонемент" param="create-subscription" />}
      </Stack>
      <TabPanel value="details">
        <ContentTabDetails studentId={studentId} />
      </TabPanel>
      <TabPanel value="visits">
        <ContentTabVisits studentId={studentId} />
      </TabPanel>

      <CreateSubscriptionModal />
    </TabContext>
  );
}
