import { useState } from 'react';
import { useParams } from 'react-router-dom';
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import Stack from '@mui/material/Stack';
import { ContentTabVisits } from './ContentTabVisits';
import { ContentTabDetails } from './ContentTabDetails';
import { useGetUserQuery } from '../../shared/api';
import { useTitle } from '../../shared/hooks/useTitle';
import { ShowError } from '../../shared/components/ShowError';
import { Loading } from '../../shared/components/Loading';

export function UserPage() {
  const [value, setValue] = useState('details');
  const { userId } = useParams();

  const {
    data: userResponse, isLoading, isError, error,
  } = useGetUserQuery(userId ?? '', {
    skip: !userId,
  });

  useTitle(userResponse?.fullname);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  if (!userResponse || !userId) {
    return null;
  }

  return (
    <TabContext value={value}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" paddingX={3}>
        <Tabs
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          sx={{ marginBottom: '1rem' }}
        >
          <Tab label="Детали" value="details" />
          <Tab label="Посещения" value="visits" />
        </Tabs>
      </Stack>
      <TabPanel value="details">
        <ContentTabDetails userId={userId} />
      </TabPanel>
      <TabPanel value="visits">
        <ContentTabVisits userId={userId} />
      </TabPanel>
    </TabContext>
  );
}
