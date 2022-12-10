import { useState } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import DeleteIcon from '@mui/icons-material/Delete';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useFetch } from '../../shared/useFetch';
import { useAppSelector } from '../../shared/useAppSelector';

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

function createCells(id: string, args: (string | number | JSX.Element)[]) {
  return args.map((value) => <TableCell key={id + value}>{value}</TableCell>);
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
  const [page, setPage] = useState(0);
  const [rowsNumber, setRowsNumbr] = useState(10);
  const { data, isLoading, error } = useFetch<ILessons>({ url: '/lesson' });
  const lessonSelector = useAppSelector((state) => state.lessonPageReduer);

  if (isLoading || !data?.payload) {
    return null;
    // return <h1>Loading ... </h1>;
  }

  if (error) {
    return <h1>Error!!! </h1>;
  }

  const { lessonSizeFilter, lessonActiveStatusFilter, lessonTitleFilter } = lessonSelector;

  const filteredData = data.payload.filter((lesson) => {
    const activeFilter = lessonActiveStatusFilter === 'active';
    return lesson.isActive === activeFilter
      && lesson.title.toLowerCase().includes(lessonTitleFilter.toLocaleLowerCase())
      && lessonSizeFilter;
  });

  const filteredRows = filteredData.map((lesson) => {
    const args = isMobile
      ? [lesson.title, lesson.activeStudents]
      : [lesson.title, 'Группа', lesson.activeStudents, lesson.isActive ? 'Активна' : 'В архиве', <DeleteIcon />];

    const cells = createCells(lesson._id, args);
    return createRow(cells);
  });

  const headerCells = isMobile
    ? [
      <TableCell>Название</TableCell>,
      <TableCell>Ученики</TableCell>,
    ]
    : headCells.map((cell) => <TableCell key={cell.id}>{cell.label}</TableCell>);

  const rowsStartIdx = page === 0 ? 0 : page * rowsNumber;
  const rowsEndIdx = page === 0 ? rowsNumber : (page + 1) * rowsNumber;

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            { createRow(headerCells) }
          </TableHead>
          <TableBody>
            { filteredRows.slice(rowsStartIdx, rowsEndIdx) }
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component='div'
        labelRowsPerPage={ isMobile ? 'Строк' : 'Показать строк' }
        rowsPerPage={rowsNumber}
        rowsPerPageOptions={[5, 10, 20]}
        count={filteredRows.length}
        page={page}
        backIconButtonProps={{
          disabled: page === 0,
        }}
        onPageChange={(event, pageNum) => setPage(pageNum)}
        onRowsPerPageChange={(event) => {
          setRowsNumbr(+event.target.value);
          setPage(0);
        }}
        sx={{
          display: 'inline-block',
          alignSelf: isMobile ? 'center' : 'right',
        }}
      />
    </>
  );
}
