import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TimetableLessonCard } from './TimetableCard';
import { ILessonModel } from '../../shared/models/ILessonModes';

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

  return <TimetableLessonCard key={lesson._id} lessonCardDetails={lesson} />;
}

function DayColumn({ startDate, shift, lessons }: IDayColumn) {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const columnDate = new Date(+startDate);
  columnDate.setDate(startDate.getDate() + shift);

  return (
    <Stack
      p='4px'
      flex={1}
      flexBasis='200px'
      position='relative'
      borderLeft='solid lightgrey'
      sx={{
        borderWidth: '0px thin',
      }}
    >
      <Box
        pl='1rem'
        mb='8px'
        borderBottom='solid lightgrey'
        sx={{
          borderWidth: '1px thin',
        }}
      >
        {getDayName(columnDate.getDay())},{!isMobile && <br />} {columnDate.toLocaleDateString('ru-RU')}
      </Box>
      {lessons && lessons.map((lesson) => renderCard(columnDate, lesson))}
    </Stack>
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

  return (
    <Stack direction='row' width='100%'>
      {isMobile
        && <DayColumn startDate={startDate} shift={0} lessons={lessons[startDate.getDay()]} />}

      {!isMobile
        && [0, 1, 2, 3, 4, 5, 6].map(
          (num) => <DayColumn
            key={+startDate + num} startDate={startDate} shift={num} lessons={lessons[num]} />,
        )}
    </Stack>
  );
}
