import { useState } from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import useMediaQuery from '@mui/material/useMediaQuery';

import DateSwitcher from './DateSwitcher';
import DayNameCells from './DayNameCells';

export default function TimetablePage() {
  const [startDate, setStartDate] = useState(new Date());
  const isMobile = useMediaQuery('(max-width: 767px)');

  return (
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <DateSwitcher startDate={startDate} setDateHandler={setStartDate} isMobile={isMobile} />
        </TableRow>
      <TableRow>
        <DayNameCells startDate={startDate} isMobile={isMobile} />
      </TableRow>
    </TableHead>
    <TableBody>

    </TableBody>
  </Table>
  );
}
