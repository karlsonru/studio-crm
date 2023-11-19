import { useMemo } from 'react';
import {
  startOfWeek, endOfWeek, addDays, subDays, format,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { timetablePageActions } from '../../shared/reducers/timetablePageSlice';
import { DateSwitcher } from '../../shared/components/DateSwitcher';

function dateFormatterWeek(date: Date | number) {
  const weekStart = format(startOfWeek(date, { weekStartsOn: 1 }), 'dd', { locale: ru });
  const weekEnd = format(endOfWeek(date, { weekStartsOn: 1 }), 'dd MMMM yyyy', { locale: ru });
  return `${weekStart} - ${weekEnd}`;
}

function dateFormatterDay(date: Date | number) {
  return format(date, 'EEEE, dd MMMM', { locale: ru, weekStartsOn: 1 });
}

export function DateSwitcherTimetable() {
  const view = useAppSelector((state) => state.timetablePageReducer.view);
  const currentDate = useAppSelector((state) => state.timetablePageReducer.currentDate);
  const actions = useActionCreators(timetablePageActions);

  const isDayView = view === 'day';

  // на сколько сдвигать дату при изменении стрелками
  const dateStep = isDayView ? 1 : 7;

  const date = useMemo(() => new Date(currentDate), [currentDate]);

  const goPreviousDate = () => {
    const prevDate = subDays(currentDate, dateStep).getTime();
    actions.setCurrentDate(prevDate);
  };

  const goNextDate = () => {
    const nextDate = addDays(currentDate, dateStep).getTime();
    actions.setCurrentDate(nextDate);
  };

  const goSelectedDate = (value: number | Date | null) => {
    const nextDate = new Date(value as Date).getTime();
    actions.setCurrentDate(nextDate);
  };

  return (
    <DateSwitcher
      date={date}
      onChange={goSelectedDate}
      onLeftArrowClick={goPreviousDate}
      onRightArrowClick={goNextDate}
      dateFormatter={isDayView ? dateFormatterDay : dateFormatterWeek}
    />
  );
}
