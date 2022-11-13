import { useCallback, useMemo } from 'react';
import { Box, Grid } from '@mui/material';
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

function DayNameCell({ date }: { date: Date }) {
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

  console.log('isLoading: {0}', isLoading);

  if (error) {
    console.log('error: {0}', error);
  }

  if (data) {
    console.log('data: {0}', data);
  }

  return (
    <Grid item sx={{ width: '14%', fontSize: '0.7rem' }}>
      <DayNameCell date={date} />
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

    // eslint-disable-next-line no-plusplus
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
