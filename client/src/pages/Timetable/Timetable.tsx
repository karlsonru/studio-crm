import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import DateSwitcher from './DateSwitcher';
import DayColumns from './DayColumns';

export default function TimetablePage() {
  const [startDate, setStartDate] = useState(new Date());
  const isMobile = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    const monday = new Date();

    if (monday.getDay() === 1) return;

    const shift = monday.getDay() === 0 ? 1 : 1 - monday.getDay();
    monday.setDate(monday.getDate() + shift);

    setStartDate(monday);
  }, []);

  return (
    <Grid container direction='column' justifyContent='flex-start' width='100%'>
      <Grid container wrap='nowrap' justifyContent='flex-start' alignItems='center'>
        <DateSwitcher startDate={startDate} setDateHandler={setStartDate} isMobile={isMobile} />
      </Grid>
      <Grid container wrap="nowrap">
        <DayColumns startDate={startDate} isMobile={isMobile} />
      </Grid>
  </Grid>
  );
}
