import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { useMobile } from '../../shared/hooks/useMobile';
import { studentsPageActions } from '../../shared/reducers/studentsPageSlice';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useActionCreators } from '../../shared/hooks/useActionCreators';

interface IHeaderCell {
  id: string;
  label: string;
  sortable?: boolean;
}

const tableHeaderCells: IHeaderCell[] = [
  {
    id: 'fullname',
    label: 'Ученик',
    sortable: true,
  },
  {
    id: 'phone',
    label: 'Телефон',
  },
  {
    id: 'sex',
    label: 'Пол',
    sortable: true,
  },
  {
    id: 'birthday',
    label: 'День рождения',
    sortable: true,
  },
  {
    id: 'isActive',
    label: 'Статус',
    sortable: true,
  },
  {
    id: 'remove',
    label: '',
  },
];

interface IHeaderCellParams {
  cell: IHeaderCell;
  params: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    sortHandler: (event: React.MouseEvent) => void;
  }
}

function HeaderCell({ cell, params }: IHeaderCellParams) {
  if (!cell.sortable) {
    return <TableCell key={cell.id}>{cell.label}</TableCell>;
  }

  const { sortBy, sortOrder, sortHandler } = params;

  return (
    <TableCell
      key={cell.id}
      sortDirection={sortBy === cell.id ? sortOrder : 'asc'}>
      <TableSortLabel
        id={cell.id}
        active={sortBy === cell.id }
        direction={sortBy === cell.id ? sortOrder : 'asc'}
        onClick={sortHandler}
      >
        {cell.label}
      </TableSortLabel>
    </TableCell>
  );
}

export function TableHeader() {
  const isMobile = useMobile();
  const actions = useActionCreators(studentsPageActions);
  const sortBy = useAppSelector((state) => state.studentsPageReducer.sort.item);
  const sortOrder = useAppSelector((state) => state.studentsPageReducer.sort.order);

  const sortHandler = (event: React.MouseEvent) => {
    const elem = event.target as HTMLElement;

    if (elem.id === sortBy) {
      actions.setSort({ order: sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      actions.setSort({ item: elem.id, order: 'desc' });
    }
  };

  const sortParams = {
    sortBy,
    sortOrder,
    sortHandler,
  };

  const cells = isMobile ? [tableHeaderCells[0]] : tableHeaderCells;

  return (
    <TableRow>
      {cells.map((cell) => <HeaderCell key={cell.id} cell={cell} params={sortParams} />)}
    </TableRow>
  );
}
