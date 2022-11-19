import { useCallback, useMemo } from 'react';
import { Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { LessonCard } from './LessonCard';
import useFetch from '../../shared/useFetch';

function getDayName(day: number) {
  const dayNames: { [code: number]: string } = {
    0: 'Воскресенье',
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница',
    6: 'Суббота',
  };
  return dayNames[day];
}

function createDayLessonsQuery(date: Date) {
  return {
    query: {
      day: date.getDay(),
      date: +date,
      isActive: true,
    },
  };
}

function DayColumn({ date, width }: { date: Date, width: string }) {
  const findDayLessonsQuery = useMemo(() => createDayLessonsQuery(date), [date]);
  const fetch = useCallback(useFetch, [date, findDayLessonsQuery]);

  const { isLoading, data, error } = fetch({ url: '/lesson/findByDay', method: 'POST', body: findDayLessonsQuery });

  const loading = isLoading ? <CircularProgress /> : null;
  const errorMsg = error ? '<span>Произошла ошибка</span>' : null;
  const lessons = data && data.payload
    ? data.payload.map((lesson) => <LessonCard key={lesson._id} cardDetails={lesson} />)
    : null;

  return (
    <Grid item p='4px' width={width}>
      <span>{getDayName(date.getDay())},<br />{date.toLocaleDateString('ru-RU')}</span>
      {loading}
      {errorMsg}
      {lessons}
    </Grid>
  );
}

interface IDayNameCells {
  isMobile: boolean;
  startDate: Date;
}

export default function DayColumns({ isMobile, startDate }: IDayNameCells) {
  const renderCells = ({ date, num }: { date: Date, num: Number }) => {
    const cells = [];

    const width = isMobile ? '100%' : '14%';

    for (let i = 0; i < num; i++) {
      const initialDate = new Date(+date);
      initialDate.setDate(initialDate.getDate() + i);
      cells.push(<DayColumn key={+initialDate} date={initialDate} width={width} />);
    }

    return cells;
  };

  const cells = renderCells({ date: startDate, num: isMobile ? 1 : 7 });

  return (
    <Grid container wrap='nowrap' width='100%'>
      {cells}
    </Grid>
  );
}
