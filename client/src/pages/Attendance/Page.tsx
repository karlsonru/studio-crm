import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/system/Stack';
import { LessonsList } from './LessonsList';
import { Participants } from './Participants';
import { LessonDetails } from './LessonDetails';
import { DateSwitcherAttendance } from './DateSwitcherAttendance';
import { Loading } from '../../shared/components/Loading';
import { useTitle } from '../../shared/hooks/useTitle';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { attendancePageActions } from '../../shared/reducers/attendancePageSlice';
import { useFindWithParamsLessonsQuery } from '../../shared/api';
import { ShowError } from '../../shared/components/ShowError';
import { useAppSelector } from '../../shared/hooks/useAppSelector';

const AttendanceHeader = React.memo(() => (
  <Box component='header' mx='1rem'>
    <DateSwitcherAttendance />
  </Box>
));

export function AttendancePage() {
  useTitle('Посещения');

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedLessonId = searchParams.get('lessonId');

  const actions = useActionCreators(attendancePageActions);
  const searchDateTimestamp = useAppSelector(
    (state) => state.attendancePageReducer.searchDateTimestamp,
  );

  useEffect(() => {
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const day = searchParams.get('day');

    // если дата в search params - обновим state для соответствия даты в state и params
    if (year && month && day) {
      const searchDate = Date.UTC(+year, +month - 1, +day);

      if (searchDate !== searchDateTimestamp) {
        actions.setSearchDateTimestamp(searchDate);
      }

      if (selectedLessonId) {
        actions.setSearchLessonId(selectedLessonId);
      }
    // если даты нет в search params - добавим самостоятельно текущий день в UTC
    } else {
      const today = new Date();

      setSearchParams({
        year: today.getFullYear().toString(),
        month: (today.getMonth() + 1).toString(),
        day: today.getDate().toString(),
      });

      const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

      actions.setSearchDateTimestamp(todayUTC);
    }
  }, [searchParams, actions, searchDateTimestamp]);

  const {
    data: lessons,
    isLoading,
    isError,
    error,
  } = useFindWithParamsLessonsQuery({
    params: {
      weekday: new Date(searchDateTimestamp).getDay(),
      dateFrom: searchDateTimestamp,
      dateTo: searchDateTimestamp,
    },
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
      <AttendanceHeader />
      <Stack direction="row" flexWrap="wrap" spacing={2}>
        <LessonsList lessons={lessons} />

        {selectedLesson && <LessonDetails lesson={selectedLesson} />}

        {selectedLesson && <Participants selectedLesson={selectedLesson} />}
      </Stack>
    </>
  );
}
