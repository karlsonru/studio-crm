import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Stack from '@mui/system/Stack';
import { LessonsList } from './LessonsList';
import { LessonInfo } from './LessonInfo';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { setPageTitle } from '../../shared/reducers/appMenuSlice';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { visitsPageActions } from '../../shared/reducers/visitsPageSlice';
import { getTodayTimestamp } from '../../shared/helpers/getTodayTimestamp';
import { DateSwitcher } from '../../shared/components/DateSwitcher';

function dateFormatterDay(date: Date | number) {
  return format(date, 'EEEE, dd MMMM', { locale: ru, weekStartsOn: 1 });
}

function DateSwitcherVisitedLesson() {
  const actions = useActionCreators(visitsPageActions);
  const [searchParams, setSearchParams] = useSearchParams();
  const [date, setDate] = useState(+(searchParams.get('date') ?? getTodayTimestamp()));

  useEffect(() => {
    actions.setCurrentDateTimestamp(date);
    setSearchParams({ date: date.toString() });
  }, [date]);

  const goNextDate = () => {
    setDate(() => date + 86_400_000);
  };

  const goPrevDate = () => {
    setDate(() => date - 86_400_000);
  };

  const goSelectedDate = (value: number | Date | null) => {
    setDate(() => (value as Date).getTime());
  };

  return (
    <DateSwitcher
      date={new Date(date)}
      onChange={goSelectedDate}
      onLeftArrowClick={goPrevDate}
      onRightArrowClick={goNextDate}
      dateFormatter={dateFormatterDay}
      wrapperProps={{
        justifyContent: 'space-between',
        sx: {
          width: '300px',
        },
      }}
    />
  );
}

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
      <header style={{ margin: '1rem 0' }}>
        <DateSwitcherVisitedLesson />
      </header>
      <Stack direction="row" flexWrap="wrap" spacing={2} >
        <LessonsList />
        <LessonInfo />
      </Stack>
    </>
  );
}
