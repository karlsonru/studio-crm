import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/system/Stack';
import { LessonsList } from './LessonsList';
import { LessonInfo } from './LessonInfo';
import { DateSwitcherAttendance } from './DateSwitcherAttendance';
import { Loading } from '../../shared/components/Loading';
import { useTitle } from '../../shared/hooks/useTitle';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { attendancePageActions } from '../../shared/reducers/attendancePageSlice';
import { useFindLessonsQuery } from '../../shared/api';
import { ShowError } from '../../shared/components/ShowError';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { getTodayTimestamp } from '../../shared/helpers/getTodayTimestamp';

const Header = React.memo(() => (
  <Box component='header' mx='1rem'>
    <DateSwitcherAttendance />
  </Box>
));

export function AttendancePage() {
  useTitle('Посещения');

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedLessonId = searchParams.get('lessonId');

  const actions = useActionCreators(attendancePageActions);
  const currentDateTimestamp = useAppSelector(
    (state) => state.attendancePageReducer.currentDateTimestamp,
  );

  useEffect(() => {
    const date = searchParams.get('date');

    // если даты нет в search params - добавим самостоятельно текущий день в UTC
    if (!date) {
      setSearchParams({ date: getTodayTimestamp().toString() });
      actions.setCurrentDateTimestamp(getTodayTimestamp());
    // если есть - обновим state чтобы дата в state соответствовала дате в params
    } else if (+date !== currentDateTimestamp) {
      actions.setCurrentDateTimestamp(+date);
    }
  });

  const {
    data: lessons, isLoading, isError, error,
  } = useFindLessonsQuery({
    day: new Date(currentDateTimestamp).getDay(),
    dateTo: { $gte: currentDateTimestamp },
    dateFrom: { $lte: currentDateTimestamp },
  });

  const selectedLesson = useMemo(
    () => lessons?.find((lesson) => lesson._id === selectedLessonId),
    [selectedLessonId, lessons],
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  if (!lessons) {
    return null;
  }

  return (
    <>
      <Header />
      <Stack direction="row" flexWrap="wrap" spacing={2}>
        <LessonsList lessons={lessons} />
        {selectedLesson && <LessonInfo selectedLesson={selectedLesson} />}
      </Stack>
    </>
  );
}
