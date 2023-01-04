import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DateSwitcher } from './TimetableHeader';
import { DayColumns } from './DayColumns';
import { useGetLessonsQuery } from '../../shared/reducers/api';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { setPageTitle } from '../../shared/reducers/appMenuSlice';
import { ILessonModel } from '../../shared/models/ILessonModel';

function structureLessons(lessons: ILessonModel[]) {
  const lessonsObj = {} as { [index: number]: ILessonModel[] };

  for (let i = 0; i < lessons.length; i++) {
    if (lessonsObj[lessons[i].day]) {
      lessonsObj[lessons[i].day].push(lessons[i]);
    } else {
      lessonsObj[lessons[i].day] = [lessons[i]];
    }
  }

  return lessonsObj;
}

function TimeColumn() {
  const time = ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'];

  return (
    <Box p='4px' mt='44px'>
      { time.map((hh) => <Box key={hh} height='120px'>{hh}:00</Box>) }
    </Box>
  );
}

export function TimetablePage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [startDate, setStartDate] = useState(new Date());
  const { isLoading, data, error } = useGetLessonsQuery();

  useEffect(() => {
    if (startDate.getDay() === 1) return;

    const monday = new Date();
    const shift = monday.getDay() === 0 ? 1 : 1 - monday.getDay();
    monday.setDate(monday.getDate() + shift);

    setStartDate(monday);

    dispatch(setPageTitle('Расписание'));
  }, []);

  return (
    <>
      <DateSwitcher startDate={startDate} setDateHandler={setStartDate} />
      <Stack direction='row'>
        {!isMobile && <TimeColumn />}
        {isLoading && <CircularProgress />}
        {error && <span>Произошла ошибка!</span>}
        {data?.payload
          && <DayColumns startDate={startDate} lessons={structureLessons(data.payload)} />
        }
      </Stack>
    </>
  );
}
