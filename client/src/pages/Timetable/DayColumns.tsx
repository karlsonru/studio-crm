import { Grid, useMediaQuery } from '@mui/material';
import { ILessonModel, LessonCard } from './LessonCard';

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

interface IDayColumn {
  startDate: Date;
  shift: number;
  lessons: ILessonModel[];
}

function renderCard(date: Date, lesson: ILessonModel) {
  if (lesson.dateTo < +date || lesson.dateFrom > +date) {
    return;
  }

  return <LessonCard key={lesson._id} lessonCardDetails={lesson} />;
}

function DayColumn({ startDate, shift, lessons }: IDayColumn) {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const columnDate = new Date(+startDate);
  columnDate.setDate(startDate.getDate() + shift);

  return (
    <Grid item
      padding='4px'
      sx={{
        flexBasis: '200px',
        flex: 1,
        position: 'relative',
        borderLeft: 'solid lightgrey',
        borderWidth: '0px thin',
      }}
    >
      <div
      style={{
        paddingLeft: '1rem',
        marginBottom: '8px',
        borderBottom: 'solid lightgrey',
        borderWidth: '1px thin',
      }}>
        {getDayName(columnDate.getDay())},{!isMobile && <br />} {columnDate.toLocaleDateString('ru-RU')}
      </div>
      {lessons && lessons.map((lesson) => renderCard(columnDate, lesson))}
    </Grid>
  );
}

interface IDayColumns {
  startDate: Date;
  lessons: {
    [index: number]: ILessonModel[];
  }
}

export function DayColumns({ startDate, lessons }: IDayColumns) {
  const isMobile = useMediaQuery('(max-width: 767px)');

  if (isMobile) {
    return (
      <Grid container wrap='nowrap' width='100%'>
        <DayColumn startDate={startDate} shift={1} lessons={lessons[startDate.getDay()]}/>
      </Grid>
    );
  }

  return (
    <Grid container wrap='nowrap' width='100%'>
      {[0, 1, 2, 3, 4, 5, 6].map(
        (num) => <DayColumn
          key={+startDate + num} startDate={startDate} shift={num} lessons={lessons[num]} />,
      )}
    </Grid>
  );
}
