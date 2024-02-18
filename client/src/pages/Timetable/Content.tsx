import { useEffect, useMemo, useState } from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Stack from '@mui/system/Stack';
import {
  eachMinuteOfInterval,
  format,
  isMonday,
  previousMonday,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { ContentCard } from './ContentCard';
import { ILessonModel } from '../../shared/models/ILessonModel';
import { useAppSelector } from '../../shared/hooks/useAppSelector';

const TIME_STEP: 60 | 30 = 30;
const TIME_START = 9;
const TIME_END = 22;
const FIRST_COLUMN_WIDTH = '2%';
const COLUMN_WIDTH = '14%';
const TABLE_MIN_WIDTH = '1650px';

const CELL_STYLE = {
  position: 'relative',
  border: '1px solid lightgrey',
  height: '28px',
};

// заполним строки для рендеринга
function fillRowsWithContent(lessons: Array<ILessonModel>) {
  const rows: Record<string, Array<null | ILessonModel>> = {};

  // для колонки с временем получаем массив из всех временных интервалов в формате строк ЧЧ:ММ
  const timeIntervals = eachMinuteOfInterval({
    start: new Date(1970, 0, 1, TIME_START),
    end: new Date(1970, 0, 1, TIME_END),
  }, {
    step: TIME_STEP,
  });

  // добавим информацию по ячейкам в каждый временной интервал / строку
  timeIntervals.map((date) => {
    const time = format(date, 'HH:mm');
    rows[time] = Array(7).fill(null);
    return time;
  });

  // для каждого занятия найдём интервал, к которому оно относится
  lessons.forEach((lesson) => {
    const lessonInterval = timeIntervals.find((interval) => {
      if (
        lesson.timeStart.hh === interval.getHours()
        && lesson.timeStart.min - interval.getMinutes() < TIME_STEP
        && lesson.timeStart.min >= interval.getMinutes()
      ) {
        return interval;
      }

      return null;
    });

    if (!lessonInterval) return;

    const time = format(lessonInterval, 'HH:mm');

    // добавим к строке с таким же временным интервалом
    rows[time][lesson.day === 0 ? 6 : lesson.day - 1] = lesson;
  });

  return rows;
}

interface ICell {
  content: string | ILessonModel | null;
  idx: number;
  date: number;
}

function Cell({ content, idx, date }: ICell) {
  if (content === null || typeof content === 'string') {
    return (
      <TableCell sx={{
        ...CELL_STYLE,
        width: idx === 0 ? FIRST_COLUMN_WIDTH : COLUMN_WIDTH,
      }}>
        { content }
      </TableCell>
    );
  }

  return (
    <TableCell sx={CELL_STYLE}>
      <ContentCard lesson={content} step={TIME_STEP} date={date} />
    </TableCell>
  );
}

interface IRow {
  content: Array<string | ILessonModel | null>;
  dates: Array<number>;
}

function Row({ content, dates }: IRow) {
  const time = content[0] as string;

  return (
    <TableRow>
      { content.map((item, idx) => (
        <Cell
          key={time + idx}
          content={item}
          idx={idx}
          date={idx === 0 ? 0 : dates[idx - 1]}
        />
      ))
      }
    </TableRow>
  );
}

export function TimetableContent({ lessons }: { lessons: Array<ILessonModel> }) {
  const view = useAppSelector((state) => state.timetablePageReducer.view);
  const currentDate = useAppSelector((state) => state.timetablePageReducer.currentDate);
  const [dates, setDates] = useState<Array<number>>([]);

  // запоминаем какой установлен вид отображения
  const isDayView = view === 'day';
  const currentDay = new Date(currentDate).getDay();

  // отфильтруем все занятия для этого дня недели и отсортируем их по времени начала
  const dayLessons = useMemo(() => {
    // не проводим фильтрацию если режим отображения Неделя
    if (!isDayView) return [];

    return lessons.filter((lesson) => lesson.day === currentDay);
  }, [currentDate, view]);

  // запомним дату, с которой нужно рисовать даты в заголовках
  const startDateTimestamp = isMonday(currentDate)
    ? currentDate
    : previousMonday(currentDate).getTime();

  // вычисляем даты в заголовках при изменении стартовой даты
  useEffect(() => {
    // не нужно вычислять, если у нас режим отображения - день
    if (isDayView) return;

    const startDate = new Date(startDateTimestamp);
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const date = startDate.getDate();

    // дату складываем в UTC
    const interval = [0, 1, 2, 3, 4, 5, 6].map((i) => Date.UTC(year, month, date + i));

    setDates(interval);
  }, [startDateTimestamp]);

  // для вида День рисуем просто одну колонку с занятиями
  if (isDayView) {
    return (
      <Stack direction="column">
        {
          dayLessons.map((lesson) => <ContentCard
            key={lesson._id}
            lesson={lesson}
            step={TIME_STEP}
            date={currentDate}
          />)
        }
      </Stack>
    );
  }

  // поделим все занятия по ячейкам и строкам
  const rowsContent = fillRowsWithContent(lessons);

  const dateNames = [null, ...dates.map((intervalDate) => format(intervalDate, 'dd EEEE', { locale: ru }))];

  return (
    <Table
      sx={{
        overflowX: 'scroll',
        minWidth: TABLE_MIN_WIDTH,
      }}
    >
      <TableHead>
        <Row content={dateNames} dates={dates} />
      </TableHead>

      <TableBody>
        {Object.entries(rowsContent).map(
          (interval) => {
            const [time, content] = interval;
            return <Row key={time} content={[time, ...content]} dates={dates} />;
          },
        )}
      </TableBody>
    </Table>
  );
}
