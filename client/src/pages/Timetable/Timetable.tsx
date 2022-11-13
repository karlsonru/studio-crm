import { useState } from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import useMediaQuery from '@mui/material/useMediaQuery';

import DateSwitcher from './DateSwitcher';
import DayNameCells from './DayNameCells';

export default function TimetablePage() {
  const [startDate, setStartDate] = useState(new Date());
  const isMobile = useMediaQuery('(max-width: 767px)');

  const renderRow = ({ i, cells }: { i: number, cells: Array<React.ReactNode> }) => {
    const TimeCell = isMobile ? null : <TableCell>{i.toString().padStart(2, '0')}:00</TableCell>;
    return (
      <TableRow>
        {TimeCell}
        {cells}
      </TableRow>
    );
  };

  const renderRows = (cells: Array<React.ReactNode>) => {
    const rows = [];
    for (let i = 7; i < 23; i++) {
      rows.push(renderRow({ i, cells }));
    }
    return rows;
  };

  const cells = [
    <TableCell />,
    <TableCell />,
    <TableCell />,
    <TableCell />,
    <TableCell />,
    <TableCell />,
    <TableCell />,
  ];

  const rows = renderRows(cells);

  return (
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <DateSwitcher startDate={startDate} setDateHandler={setStartDate} isMobile={isMobile} />
        </TableRow>
        <TableRow>
          <TableCell sx={{ width: '2%' }}>Время</TableCell>
          <DayNameCells startDate={startDate} isMobile={isMobile} />
        </TableRow>
          {rows}
        </TableHead>
      <TableBody>
      </TableBody>
  </Table>
  );
}
