import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TabContext from '@mui/lab/TabContext';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TabPanel from '@mui/lab/TabPanel';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { setPageTitle } from '../../shared/reducers/appMenuSlice';
import { useGetLessonQuery } from '../../shared/api';
import { ContentSubscriptions } from './ContentSubscriptions';

export function LessonPage() {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState('subscriptions');

  const { lessonId } = useParams();

  const { data, isError } = useGetLessonQuery(lessonId ?? 'null');

  useEffect(() => {
    dispatch(setPageTitle(data?.payload.title ?? 'Занятия'));
  }, [data]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (isError || !lessonId) {
    return <h1>Такого занятия не существует</h1>;
  }

  return (
    <TabContext value={value}>
      <Tabs value={value} onChange={handleChange} sx={{ marginBottom: '1rem' }}>
        <Tab label="Абонементы" value="subscriptions" />
        <Tab label="Участники" value="students" />
      </Tabs>
      <TabPanel value="subscriptions">
        <ContentSubscriptions lessonId={lessonId} />
      </TabPanel>
      <TabPanel value="students">
        Участники
      </TabPanel>
    </TabContext>
  );
}
