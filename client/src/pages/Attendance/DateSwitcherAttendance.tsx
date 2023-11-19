import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { attendancePageActions } from '../../shared/reducers/attendancePageSlice';
import { DateSwitcher } from '../../shared/components/DateSwitcher';
import { useAppSelector } from '../../shared/hooks/useAppSelector';

function dateFormatterDay(date: Date | number) {
  return format(date, 'EEEE, dd MMMM', { locale: ru, weekStartsOn: 1 });
}

export function DateSwitcherAttendance() {
  const actions = useActionCreators(attendancePageActions);
  const [, setSearchParams] = useSearchParams();
  const date = useAppSelector((state) => state.attendancePageReducer.currentDateTimestamp);

  const updateDate = (newDate: number) => {
    actions.setCurrentDateTimestamp(newDate);
    setSearchParams({ date: newDate.toString() });
  };

  const goNextDate = () => {
    const nextDate = date + 86_400_000;
    updateDate(nextDate);
  };

  const goPrevDate = () => {
    const prevDate = date - 86_400_000;
    updateDate(prevDate);
  };

  const goSelectedDate = (value: number | Date | null) => {
    const selectedDate = (value as Date).getTime();
    updateDate(selectedDate);
  };

  return (
    <DateSwitcher
      date={new Date(date)}
      onChange={goSelectedDate}
      onLeftArrowClick={goPrevDate}
      onRightArrowClick={goNextDate}
      dateFormatter={dateFormatterDay}
      wrapperProps={{
        justifyContent: 'space-between',
        sx: {
          width: '300px',
        },
      }}
    />
  );
}
