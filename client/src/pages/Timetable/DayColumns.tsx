import { useCallback, useMemo } from 'react';
import { Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { ICardDetails, LessonCard } from './LessonCard';
import { useFetch } from '../../shared/useFetch';

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

type ICreateDayLessonsQuery = ReturnType<typeof createDayLessonsQuery>;

interface ILessonByDay {
  message: string;
  payload: ICardDetails[];
}

function renderLessonsCards(data: ICardDetails[], isMobile: boolean) {
  return data.map(
    (lesson) => <LessonCard key={lesson._id} cardDetails={lesson} isMobile={isMobile} />,
  );
}

function DayColumn({ date, isMobile }: { date: Date, isMobile: boolean }) {
  const findDayLessonsQuery = useMemo(() => createDayLessonsQuery(date), [date]);
  const fetch = useCallback(useFetch, [date, findDayLessonsQuery]);

  const { isLoading, data, error } = fetch<ILessonByDay, ICreateDayLessonsQuery>('/lesson/findByDay', 'POST', findDayLessonsQuery);

  return (
    <Grid item
      width={isMobile ? '100%' : '14%'}
      padding='4px'
      sx={isMobile ? {} : {
        position: 'relative',
        borderLeft: 'solid lightgrey',
        borderWidth: '0px thin',
      }}
    >
      <span style={{ display: 'inline-block', marginBottom: '8px' }}>
        {getDayName(date.getDay())},<br />{date.toLocaleDateString('ru-RU')}
      </span>
      {isLoading && <CircularProgress />}
      {error && <span>Произошла ошибка</span>}
      {data?.payload && renderLessonsCards(data.payload, isMobile)}
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
      cells.push(<DayColumn key={+initialDate} date={initialDate} isMobile={isMobile} />);
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
