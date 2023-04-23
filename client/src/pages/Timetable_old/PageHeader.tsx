import {
  useState, useEffect, useRef, ChangeEvent,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/system/Stack';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { CreateLessonModal } from '../../shared/components/CreateLessonModal';

interface IDateSwitcher {
  startDate: Date;
  setDateHandler: (date: Date) => void;
}

function WeekSwitcher({ startDate, setDateHandler }: IDateSwitcher) {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [startDateString, setStartDateString] = useState('');
  const [endDateString, setEndDateString] = useState('');

  const step = isMobile ? 1 : 7;

  const increaseDateHandler = () => {
    const nextWeek = new Date(startDate);
    nextWeek.setDate(nextWeek.getDate() + step);
    setDateHandler(nextWeek);
  };

  const decreaseDateHandler = () => {
    const prevWeek = new Date(startDate);
    prevWeek.setDate(prevWeek.getDate() - step);
    setDateHandler(prevWeek);
  };

  useEffect(() => {
    setStartDateString(startDate.toLocaleDateString('ru-RU'));

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    setEndDateString(endDate.toLocaleDateString('ru-RU'));
  }, [startDate]);

  return (
    <Stack direction="row" alignItems='center'>
        <ArrowBackIosNewIcon onClick={decreaseDateHandler} fontSize="medium" />
        <Input value={startDateString} readOnly={true} size="small" inputProps={{ style: { textAlign: 'center', minWidth: '90px', maxWidth: '7rem' } }} />
        {!isMobile && <RemoveIcon />}
        {!isMobile
          && <Input value={endDateString} readOnly={true} size="small" inputProps={{ style: { textAlign: 'center', minWidth: '90px', maxWidth: '7rem' } }} />
        }
        <ArrowForwardIosIcon onClick={increaseDateHandler} fontSize="medium" />
    </Stack>
  );
}

function getMonthName(month: number) {
  const monthesName: {
    [code: number]: string
  } = {
    0: 'Январь',
    1: 'Февраль',
    2: 'Март',
    3: 'Апрель',
    4: 'Май',
    5: 'Июнь',
    6: 'Июль',
    7: 'Август',
    8: 'Сентябрь',
    9: 'Октябрь',
    10: 'Ноябрь',
    11: 'Декабрь',
  };
  return monthesName[month];
}

function MonthSwitcher({ startDate, setDateHandler }: IDateSwitcher) {
  const [monthLabel, setMonthLabel] = useState(getMonthName(10));
  const dateRef = useRef(null);

  const openDatepicker = () => {
    // @ts-ignore
    dateRef.current.showPicker();
  };

  const dateChangeHandler = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    const nextDate = new Date(Date.parse(target.value));
    setDateHandler(nextDate);
  };

  useEffect(() => {
    setMonthLabel(getMonthName(startDate.getMonth()));
  }, [startDate]);

  return (
    <FormControl onClick={openDatepicker}>
      <FormLabel sx={{ fontSize: '1.5rem' }}>
        {monthLabel}
      </FormLabel>
      <input type='date' ref={dateRef} onChange={dateChangeHandler} style={{ visibility: 'hidden' }} />
    </FormControl>
  );
}

export function TimetableHeader({ startDate, setDateHandler }: IDateSwitcher) {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [, setSearchParams] = useSearchParams();

  return (
    <header>
      <Stack direction={isMobile ? 'column' : 'row'} margin={isMobile ? '1rem 0' : 0} justifyContent="space-between" alignItems="start" width="100%">
        <Stack direction="row" justifyContent={isMobile ? 'space-between' : 'start'} alignItems="start" spacing={2}>
          <MonthSwitcher startDate={startDate} setDateHandler={setDateHandler} />
          <WeekSwitcher startDate={startDate} setDateHandler={setDateHandler} />
        </Stack>
        {!isMobile && <Button variant="contained" size="large" onClick={() => setSearchParams({ 'create-lesson': 'true' })}>Добавить</Button>}
      </Stack>
      <CreateLessonModal />
    </header>
  );
}
