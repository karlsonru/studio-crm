import * as React from 'react';
import { useMemo, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { BaseSingleInputFieldProps, FieldSection } from '@mui/x-date-pickers';
import {
  startOfWeek, endOfWeek, addDays, subDays, format,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAppSelector } from 'shared/hooks/useAppSelector';
import { useActionCreators } from 'shared/hooks/useActionCreators';
import { timetablePageActions } from 'shared/reducers/timetablePageSlice';

const getWeekStart = (date: Date) => format(startOfWeek(date, { weekStartsOn: 1 }), 'dd', { locale: ru });
const getWeekEnd = (date: Date) => format(endOfWeek(date, { weekStartsOn: 1 }), 'dd MMMM yyyy', { locale: ru });
const showDay = (date: Date) => format(date, 'dddd dd MMMM yyyy', { locale: ru });

interface ButtonFieldProps extends BaseSingleInputFieldProps<Date | null, FieldSection, any> {
  date?: Date;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isDayView?: boolean;
}

function ButtonField(props: ButtonFieldProps) {
  const {
    setOpen,
    date,
    isDayView,
    id,
    InputProps: { ref } = {},
  } = props;

  if (!date || !setOpen) return null;

  const content = isDayView ? showDay(date) : `${getWeekStart(date)} - ${getWeekEnd(date)}`;

  return (
    <Button
      variant="text"
      id={id}
      ref={ref}
      onClick={() => setOpen((prev) => !prev)}
    >
      { content }
    </Button>
  );
}

export function DateSwitcher() {
  const view = useAppSelector((state) => state.timetablePageReducer.view);
  const currentDate = useAppSelector((state) => state.timetablePageReducer.currentDate);
  const actions = useActionCreators(timetablePageActions);

  const isDayView = useMemo(() => view === 'day', [view]);

  // на сколько сдвигать дату при изменении стрелками
  const dateStep = useMemo(() => (isDayView ? 1 : 7), [isDayView, view]);

  const date = useMemo(() => new Date(currentDate), [currentDate]);
  const [open, setOpen] = useState(false);

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
    <Stack direction="row">

      <IconButton onClick={goPreviousDate}>
        <ArrowBackIosIcon />
      </IconButton>

      <DatePicker
        value={date}
        onChange={goSelectedDate}
        views={['day']}
        minDate={new Date(2020, 0, 1)}
        slots={{ field: ButtonField }}
        slotProps={{ field: { setOpen, date, isDayView } as ButtonFieldProps }}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      />

      <IconButton onClick={goNextDate}>
        <ArrowForwardIosIcon />
      </IconButton>

    </Stack>
  );
}
