import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import CircularProgress from '@mui/material/CircularProgress';
import { DateSwitcher } from './TimetableHeader';
import { DayColumns } from './DayColumns';
import { ILessonModel } from './TimetableLessonCard';
import { TimeColumn } from './TimeColumn';
import { useFetch } from '../../shared/useFetch';
import { useDocTitle } from '../../shared/useDocTitle';

interface ILessons {
  message: string;
  payload: Array<ILessonModel>;
}

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

export function TimetablePage() {
  useDocTitle('Расписание');

  const isMobile = useMediaQuery('(max-width: 767px)');
  const [startDate, setStartDate] = useState(new Date());
  const { isLoading, data, error } = useFetch<ILessons>({ url: '/lesson' });

  useEffect(() => {
    if (startDate.getDay() === 1) return;

    const monday = new Date();
    const shift = monday.getDay() === 0 ? 1 : 1 - monday.getDay();
    monday.setDate(monday.getDate() + shift);

    setStartDate(monday);
  }, []);

  console.log(data?.payload);

  return (
    <>
      <DateSwitcher startDate={startDate} setDateHandler={setStartDate} />
      <Grid container wrap="nowrap">
        {!isMobile && <TimeColumn />}
        {isLoading && <CircularProgress />}
        {error && <span>Произошла ошибка!</span>}
        {data?.payload
          && <DayColumns startDate={startDate} lessons={structureLessons(data.payload)} />
        }
      </Grid>
    </>
  );
}
