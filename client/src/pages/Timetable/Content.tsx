import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TimetableLessonCard } from './ContentCard';
import { ILessonModel } from '../../shared/models/ILessonModel';
import { getDayName } from '../../shared/helpers/getDayName';

interface IDayColumns {
  startDate: Date;
  lessons: {
    [index: number]: ILessonModel[];
  }
}

interface IDayColumn extends IDayColumns {
  shift: number;
}

function renderCard(columnDate: Date, lesson: ILessonModel) {
  if (lesson.dateTo < +columnDate || lesson.dateFrom > +columnDate) {
    return;
  }
  return <TimetableLessonCard key={lesson._id} date={columnDate} lessonCardDetails={lesson} />;
}

function DayColumn({ startDate, shift, lessons }: IDayColumn) {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const columnDate = new Date(+startDate);
  columnDate.setDate(startDate.getDate() + shift);

  const dayLessons = lessons[columnDate.getDay()];

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
        { getDayName(columnDate.getDay()) },
        { !isMobile && <br /> }
        { columnDate.toLocaleDateString('ru-RU') }
      </Box>
      {dayLessons && dayLessons.map((lesson) => renderCard(columnDate, lesson))}
    </Stack>
  );
}

export function DayColumns({ startDate, lessons }: IDayColumns) {
  const isMobile = useMediaQuery('(max-width: 767px)');

  return (
    <Stack direction='row' width='100%'>
      {isMobile
        && <DayColumn startDate={startDate} shift={0} lessons={lessons} />}

      {!isMobile
        && [0, 1, 2, 3, 4, 5, 6].map(
          (num) => <DayColumn
            key={+startDate + num} startDate={startDate} shift={num} lessons={lessons} />,
        )}
    </Stack>
  );
}
