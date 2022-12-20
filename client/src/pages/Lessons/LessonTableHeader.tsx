import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import useMediaQuery from '@mui/material/useMediaQuery';

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

export function TableHeader(
  { sortable, sortBy, sortOrder }: { sortable: Set<string>, sortBy: string, sortOrder: 'asc' | 'desc' },
) {
  const isMobile = useMediaQuery('(max-width: 767px)');

  const renderHeaderCell = (cell: { id: string, label: string }) => {
    if (!sortable.has(cell.id)) {
      return <TableCell key={cell.id}>{cell.label}</TableCell>;
    }

    return (
      <TableCell
        key={cell.id}
        sortDirection={ sortBy === cell.id ? sortOrder : 'asc' }>
        <TableSortLabel
          active={ true }
          direction={ sortBy === cell.id ? sortOrder : 'asc' }
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
