import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Stack from '@mui/system/Stack';
import { LessonsList } from './LessonsList';
import { LessonInfo } from './LessonInfo';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { setPageTitle } from '../../shared/reducers/appMenuSlice';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { visitsPageActions } from '../../shared/reducers/visitsPageSlice';
import { getTodayTimestamp } from '../../shared/helpers/getTodayTimestamp';
import { DateSwitcherVisitedLesson } from './DateSwitcherVisitedLesson';

export function VisititedLessonsPage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const actions = useActionCreators(visitsPageActions);

  useEffect(() => {
    dispatch(setPageTitle('Учёт посещений'));
  }, []);

  useEffect(() => {
    const date = searchParams.get('date');

    // если даты нет в search params - добавим самостоятельно текущий день
    if (!date) {
      setSearchParams({ date: getTodayTimestamp().toString() });
      actions.setCurrentDateTimestamp(getTodayTimestamp());
    // если есть - обновим state чтобы дата в state соответствовала дате в params
    } else {
      actions.setCurrentDateTimestamp(+date);
    }
  });

  return (
    <>
      <header
        style={{
          margin: '1rem 0',
        }}
      >
        <DateSwitcherVisitedLesson />
      </header>

      <Stack
        direction="row"
        flexWrap="wrap"
        spacing={2}
      >
        <LessonsList />
        <LessonInfo />
      </Stack>
    </>
  );
}
