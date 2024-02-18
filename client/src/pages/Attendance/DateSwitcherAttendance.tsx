import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { attendancePageActions } from '../../shared/reducers/attendancePageSlice';
import { DateSwitcher } from '../../shared/components/DateSwitcher';
import { useAppSelector } from '../../shared/hooks/useAppSelector';

const DAY_SECONDS = 86_400_000;

function dateFormatterDay(date: Date | number) {
  return format(date, 'EEEE, dd MMMM', { locale: ru, weekStartsOn: 1 });
}

export function DateSwitcherAttendance() {
  const actions = useActionCreators(attendancePageActions);
  const [, setSearchParams] = useSearchParams();
  const date = useAppSelector((state) => state.attendancePageReducer.searchDateTimestamp);

  const updateDate = (newDate: number) => {
    const updatedDate = new Date(newDate);
    actions.setSearchDateTimestamp(newDate);

    setSearchParams({
      year: updatedDate.getFullYear().toString(),
      month: (updatedDate.getMonth() + 1).toString(),
      day: updatedDate.getDate().toString(),
    });
  };

  const goNextDate = () => {
    const nextDate = date + DAY_SECONDS;
    updateDate(nextDate);
  };

  const goPrevDate = () => {
    const prevDate = date - DAY_SECONDS;
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
