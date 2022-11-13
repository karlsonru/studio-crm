import { useState } from 'react';
import { Grid } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import DateSwitcher from './DateSwitcher';
import DayColumns from './DayColumns';

export default function TimetablePage() {
  const [startDate, setStartDate] = useState(new Date());
  const isMobile = useMediaQuery('(max-width: 767px)');

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
