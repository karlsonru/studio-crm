import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';

interface IHeaderCell {
  id: string;
  label: string;
  sortable?: boolean;
}

const tableHeaderCells: IHeaderCell[] = [
  {
    id: 'title',
    label: 'Название',
  },
  {
    id: 'day',
    label: 'День',
    sortable: true,
  },
  {
    id: 'type',
    label: 'Тип',
  },
  {
    id: 'activeStudents',
    label: 'Ученики',
    sortable: true,
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
  sortBy: string;
  setSortBy: (value: 'day' | 'activeStudents') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (value: 'asc' | 'desc') => void;
}

export function TableHeader(props: ITableHeader) {
  const {
    sortBy, setSortBy, sortOrder, setSortOrder,
  } = props;
  const isMobile = useMediaQuery('(max-width: 767px)');

  const sortHandler = (event: React.MouseEvent) => {
    const elem = event.target as HTMLElement;
    if (!(elem.id === 'day' || elem.id === 'activeStudents')) return;

    if (elem.id === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(elem.id);
      setSortOrder('desc');
    }
  };

  const renderHeaderCell = (cell: IHeaderCell) => {
    if (!cell.sortable) {
      return <TableCell key={cell.id}>{cell.label}</TableCell>;
    }

    return (
      <TableCell
        key={cell.id}
        sortDirection={ sortBy === cell.id ? sortOrder : 'asc' }>
        <TableSortLabel
          id={cell.id}
          active={ sortBy === cell.id }
          direction={ sortBy === cell.id ? sortOrder : 'asc' }
          onClick={sortHandler}
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
