import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import DeleteIcon from '@mui/icons-material/Delete';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useFetch } from 'shared/useFetch';

interface ILessonModel {
  _id: string;
  title: string;
  day: number;
  teacher: {
    name: string;
    _id: string;
  };
  timeStart: number;
  timeEnd: number;
  activeStudents: number;
  dateFrom: number;
  dateTo: number;
  isActive: boolean;
}

interface ILessons {
  message: string;
  payload: Array<ILessonModel>;
}

const headCells = [
  {
    id: 'title',
    label: 'Название',
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

function createCells(args: (string | number | JSX.Element)[]) {
  return args.map((value) => <TableCell>{value}</TableCell>);
}

function createRow(cells: JSX.Element[]) {
  return (
    <TableRow>
      { cells }
    </TableRow>
  );
}

export function LessonsContent() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const { data, isLoading, error } = useFetch<ILessons>({ url: '/lesson' });

  if (isLoading || !data?.payload) {
    return <h1>Loading ... </h1>;
  }

  if (error) {
    return <h1>Error!!! </h1>;
  }

  const rows = data.payload.map((lesson) => {
    const args = isMobile ? [lesson.title, lesson.activeStudents] : [lesson.title, 'Группа', lesson.activeStudents, 'Активна', <DeleteIcon />];
    const cells = createCells(args);
    return createRow(cells);
  });

  const headerCells = headCells.map((cell) => <TableCell>{cell.label}</TableCell>);

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            { createRow(headerCells) }
          </TableHead>
          <TableBody>
            {rows}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPage={5}
        count={data.payload.length}
        page={1}
        onPageChange={() => console.log('changed')}
      />
    </>
  );
}
