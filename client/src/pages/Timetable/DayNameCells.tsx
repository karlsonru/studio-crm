import React from 'react';
import TableCell from '@mui/material/TableCell';

function getDayName(day: number) {
  const dayNames: { [code: number]: string } = {
    0: 'Воскресенье',
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница',
    6: 'Суббота',
  };
  return dayNames[day];
}

function DayNameCell({ date }: { date: Date }) {
  return (
    <TableCell sx={{ width: '14%', fontSize: '0.7rem' }}>
      <span style={{ fontWeight: 'bold' }}>{getDayName(date.getDay())},</span>
      <span style={{ marginLeft: '5px' }}>{date.toLocaleDateString('ru-RU')}</span>
    </TableCell>
  );
}

interface IDayNameCells {
  isMobile: boolean;
  startDate: Date;
}

export default function DayNameCells({ isMobile, startDate }: IDayNameCells) {
  const renderCells = ({ date, num }: { date: Date, num: Number }) => {
    const cells = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < num; i++) {
      const initialDate = new Date(+date);
      initialDate.setDate(initialDate.getDate() + i);
      cells.push(<DayNameCell key={i} date={initialDate} />);
    }

    return cells;
  };

  const cells = renderCells({ date: startDate, num: isMobile ? 1 : 7 });

  return <>{cells}</>;
}