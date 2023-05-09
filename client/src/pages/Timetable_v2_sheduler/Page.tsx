import { useEffect, useRef, useState } from 'react';
import { Scheduler } from '@aldabil/react-scheduler';
import type { ProcessedEvent, SchedulerRef } from '@aldabil/react-scheduler/types';
import { ru } from 'date-fns/locale';
import { subMonths, addMonths, eachDayOfInterval } from 'date-fns';
import { WeekProps } from '@aldabil/react-scheduler/views/Week';
import { DayProps } from '@aldabil/react-scheduler/views/Day';
import { ViewEvent } from '@aldabil/react-scheduler/types';
import { useMobile } from '../../shared/hooks/useMobile';
import { useFindLessonsQuery } from '../../shared/api/lessonApi';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { setPageTitle } from '../../shared/reducers/appMenuSlice';
import './timetable.module.scss';
import { ILessonModel } from '../../shared/models/ILessonModel';
import { EventCard } from './EventCard';
import { PreviewCard } from './PreviewCard';

// перезапишем dayValues из date-fns. Подставится нужный текст в заголовках расписания
const dayValues = {
  narrow: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  short: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  abbreviated: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

interface ILocalizeOptions {
  context: string;
  width: 'narrow' | 'short' | 'abbreviated' | 'wide';
}

if (ru.localize) {
  ru.localize.day = (day: number, options: ILocalizeOptions) => dayValues[options.width][day];
}

const weekOption: WeekProps = {
  weekDays: [0, 1, 2, 3, 4, 5, 6],
  weekStartOn: 1,
  startHour: 9,
  endHour: 22,
  step: 30,
  navigation: true,
  disableGoToDay: false,
};

const dayOptions: DayProps = {
  startHour: 9,
  endHour: 22,
  step: 60,
};

const translations = {
  navigation: {
    month: 'Месяц',
    week: 'Неделя',
    day: 'День',
    today: 'Сегодня',
  },
  form: {
    addTitle: 'Добавить',
    editTitle: 'Изменить',
    confirm: 'Подтвердить',
    delete: 'Удалить',
    cancel: 'Отмена',
  },
  event: {
    title: 'Название',
    start: 'Начало',
    end: 'Конец',
    allDay: 'Весь день',
  },
  moreEvents: 'More...',
  loading: 'Loading...',
};

function getWeekDates(period: Record<string, number>) {
  const interval = eachDayOfInterval({
    start: new Date(period.start),
    end: new Date(period.end),
  });

  const weekDates: Record<number, number> = {};
  interval.forEach((date) => {
    weekDates[date.getDay()] = date.getTime();
  });

  return weekDates;
}

function setDateWithTime(timestamp: number, hh: string, min: string) {
  const date = new Date(timestamp);
  date.setHours(+hh);
  date.setMinutes(+min);
  return date;
}

function addEvent(lesson: ILessonModel, weekDates: Record<number, number>): ProcessedEvent | {} {
  if (!weekDates[lesson.day]) return {};

  const startTime = lesson.timeStart.toString().padStart(4, '0');
  const endTime = lesson.timeEnd.toString().padStart(4, '0');
  const [startHour, startMinute] = [startTime.slice(0, 2), startTime.slice(2)];
  const [endHour, endMinute] = [endTime.slice(0, 2), endTime.slice(2)];

  return {
    event_id: lesson._id,
    title: lesson.title,
    start: setDateWithTime(weekDates[lesson.day], startHour, startMinute),
    end: setDateWithTime(weekDates[lesson.day], endHour, endMinute),
    color: '#fff',
    payload: {
      lesson,
      date: weekDates[lesson.day],
    },
  };
}

export function TimetablePage() {
  const dispatch = useAppDispatch();
  const isMobile = useMobile();
  const calendarRef = useRef<SchedulerRef>(null);

  useEffect(() => {
    dispatch(setPageTitle('Расписание'));
  }, []);

  const [period, setPeriod] = useState({ start: 0, end: 0 });

  const { data, isFetching } = useFindLessonsQuery({
    dateFrom: { $lte: subMonths(period.start, 1).setDate(1) },
    dateTo: { $gte: addMonths(period.end, 2).setDate(1) },
  }, {
    skip: !period.start || !period.end,
  });

  useEffect(() => {
    const weekDates = getWeekDates(period);
    const events = data?.payload.map((lesson) => addEvent(lesson, weekDates)) ?? [];

    calendarRef.current?.scheduler.handleState(events, 'events');
  }, [period, data]);

  useEffect(() => {
    const view = isMobile ? 'day' : 'week';
    calendarRef.current?.scheduler.handleState(view, 'view');
  }, [isMobile]);

  const getRemoteEvents = async (query: ViewEvent) => {
    const { start, end } = query;

    setPeriod({
      start: start.getTime(),
      end: end.getTime(),
    });
  };

  return (
    <Scheduler
      ref={calendarRef}
      view={isMobile ? 'day' : 'week'}
      month={null}
      getRemoteEvents={getRemoteEvents}
      week={weekOption}
      day={dayOptions}
      loading={isFetching}
      locale={ru}
      hourFormat="24"
      timeZone="Europe/Moscow"
      draggable={false}
      editable={false}
      deletable={false}
      translations={translations}
      eventRenderer={EventCard}
      customViewer={(event: ProcessedEvent) => <PreviewCard event={event} />}
      onEventClick={() => console.log('clicked')}
      // viewerTitleComponent={(event) => <PreviewCardTitle title={event.title} />}
      // viewerExtraComponent={viewerExtraComponent} // here goes custom description in preview
    />
  );
}
