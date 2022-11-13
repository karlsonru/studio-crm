import {
  useState, useEffect, useRef, ChangeEvent,
} from 'react';
import { Grid } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Input from '@mui/material/Input';
import RemoveIcon from '@mui/icons-material/Remove';
import InputLabel from '@mui/material/InputLabel';

interface IDateSwitcher {
  startDate: Date;
  setDateHandler: (date: Date) => void;
  isMobile?: boolean;
}

function WeekSwitcher({ startDate, setDateHandler, isMobile }: IDateSwitcher) {
  const [startDateString, setStartDateString] = useState('');
  const [endDateString, setEndDateString] = useState('');
  const [changeDateStep, setChangeDateStep] = useState(isMobile ? 1 : 7);

  const increaseDateHandler = () => {
    const nextWeek = new Date(startDate);
    nextWeek.setDate(nextWeek.getDate() + changeDateStep);
    setDateHandler(nextWeek);
  };

  const decreaseDateHandler = () => {
    const prevWeek = new Date(startDate);
    prevWeek.setDate(prevWeek.getDate() - changeDateStep);
    setDateHandler(prevWeek);
  };

  useEffect(() => {
    setChangeDateStep(isMobile ? 1 : 7);
  }, [isMobile]);

  useEffect(() => {
    setStartDateString(startDate.toLocaleDateString('ru-RU'));

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    setEndDateString(endDate.toLocaleDateString('ru-RU'));
  }, [startDate]);

  const splitIcon = isMobile ? null : <RemoveIcon />;

  const endDateInput = isMobile
    ? null
    : <Input value={endDateString} readOnly={true} size="small" inputProps={{ style: { textAlign: 'center', minWidth: '100px', maxWidth: '7rem' } }} />;

  return (
    <Grid container alignItems='center'>
        <ArrowBackIosNewIcon onClick={decreaseDateHandler} fontSize="medium" />
        <Input value={startDateString} readOnly={true} size="small" inputProps={{ style: { textAlign: 'center', minWidth: '100px', maxWidth: '7rem' } }} />
        {splitIcon}
        {endDateInput}
        <ArrowForwardIosIcon onClick={increaseDateHandler} fontSize="medium" />
    </Grid>
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
    <Grid item onClick={openDatepicker} sx={{ display: 'flex', flexDirection: 'column' }} >
      <InputLabel variant="filled" sx={{ textAlign: 'center', fontSize: '1.25rem', marginBottom: '10px' }}>
        {monthLabel}
      </InputLabel>
      <input
        type='date'
        ref={dateRef}
        onChange={dateChangeHandler}
        style={{ visibility: 'hidden', maxWidth: '100px' }}
      />
    </Grid>
  );
}

export default function DateSwitcher({ startDate, setDateHandler, isMobile }: IDateSwitcher) {
  return (
    <>
      <MonthSwitcher startDate={startDate} setDateHandler={setDateHandler} />
      <WeekSwitcher startDate={startDate} setDateHandler={setDateHandler} isMobile={isMobile} />
    </>
  );
}
