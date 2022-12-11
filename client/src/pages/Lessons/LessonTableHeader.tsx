import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';

const tableHeaderCells = [
  {
    id: 'title',
    label: 'Название',
  },
  {
    id: 'day',
    label: 'День',
  },
  {
    id: 'type',
    label: 'Тип',
  },
  {
    id: 'activeStudents',
    label: 'Ученики',
  },
  {
    id: 'isActive',
    label: 'Статус',
  },
  {
    id: 'remove',
    label: '',
  },
];

interface ITableHeader {
  sortIds: Set<string>;
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (value: 'asc' | 'desc') => void;
}

export function TableHeader({
  sortIds, sortBy, setSortBy, sortOrder, setSortOrder,
}: ITableHeader) {
  const isMobile = useMediaQuery('(max-width: 767px)');

  const clickSortHandler = (event: React.MouseEvent) => {
    const elem = event.target as HTMLElement;

    if (elem.id === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(elem.id);
      setSortOrder('desc');
    }
  };

  const renderHeaderCell = (cell: { id: string, label: string }) => {
    if (!sortIds.has(cell.id)) {
      return <TableCell key={cell.id}>{cell.label}</TableCell>;
    }

    return (
      <TableCell
        key={cell.id}
        sortDirection={ sortBy === cell.id ? sortOrder : 'asc' }>
        <TableSortLabel
          id={cell.id}
          direction={ sortBy === cell.id ? sortOrder : 'asc' }
          onClick={clickSortHandler}
        >
          { cell.label }
        </TableSortLabel>
      </TableCell>
    );
  };

  if (isMobile) {
    return (
      <TableRow>
        { [tableHeaderCells[0], tableHeaderCells[3]].map((cell) => renderHeaderCell(cell)) }
      </TableRow>
    );
  }

  return (
    <TableRow>
      { tableHeaderCells.map((cell) => renderHeaderCell(cell)) }
    </TableRow>
  );
}
