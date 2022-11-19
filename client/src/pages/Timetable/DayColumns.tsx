import { useCallback, useMemo } from 'react';
import { Grid, Box } from '@mui/material';
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

function DayTitle({ date }: { date: Date }) {
  return (
    <Box>
      <span style={{ fontWeight: 'bold' }}>{getDayName(date.getDay())},</span>
      <span style={{ marginLeft: '5px' }}>{date.toLocaleDateString('ru-RU')}</span>
    </Box>
  );
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

function DayColumn({ date }: { date: Date }) {
  const findDayLessonsQuery = useMemo(() => createDayLessonsQuery(date), [date]);
  const fetch = useCallback(useFetch, [date, findDayLessonsQuery]);

  const { isLoading, data, error } = fetch({ url: '/lesson/findByDay', method: 'POST', body: findDayLessonsQuery });

  const loading = isLoading ? <CircularProgress /> : null;
  const errorMsg = error ? '<span>Произошла ошибка</span>' : null;
  const lessons = data && data.payload
    ? data.payload.map((lesson) => <LessonCard key={lesson.id} cardDetails={lesson} />)
    : null;

  return (
    <Grid item sx={{ width: '14%', fontSize: '0.7rem' }}>
      <DayTitle date={date} />
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

    for (let i = 0; i < num; i++) {
      const initialDate = new Date(+date);
      initialDate.setDate(initialDate.getDate() + i);
      cells.push(<DayColumn key={i} date={initialDate} />);
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
