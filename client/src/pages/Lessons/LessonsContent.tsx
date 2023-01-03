import { useState, useCallback } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import DeleteIcon from '@mui/icons-material/Delete';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import { TableHeader } from './LessonTableHeader';
import { useGetLessonsQuery } from '../../shared/reducers/api';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { ILessonModel } from '../../shared/models/ILessonModes';
import { ConfirmationDialog, DeleteDialogText } from '../../shared/components/ConfirmationDialog';

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

function createRow(id: string, args: (string | number | JSX.Element)[]) {
  return (
    <TableRow key={id}>
      { args.map((value) => <TableCell key={id + value}>{value}</TableCell>) }
    </TableRow>
  );
}

function getRowArguments(
  lesson: ILessonModel,
  isMobile: boolean,
  deleteLessonHandler: (lesson: ILessonModel) => void,
) {
  if (isMobile) {
    return [lesson.title, lesson.activeStudents];
  }

  return ([
    lesson.title,
    getDayName(lesson.day),
    'Группа',
    lesson.activeStudents,
    lesson.isActive ? 'Активна' : 'В архиве',
    <IconButton onClick={() => deleteLessonHandler(lesson)}><DeleteIcon /></IconButton>,
  ]);
}

export function LessonsContent() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [isModalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsNumber, setRowsNumbr] = useState(10);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [lessonDetails, setLessonDetails] = useState<ILessonModel | null>(null);

  const deleteLessonHandler = useCallback((currentLesson: ILessonModel) => {
    setLessonDetails(currentLesson);
    setModalOpen(true);
  }, [setModalOpen, setLessonDetails]);

  const { data, isLoading, error } = useGetLessonsQuery();
  const lessonSelector = useAppSelector((state) => state.lessonPageReduer);

  if (isLoading || !data?.payload) {
    return null;
  }

  if (error) {
    return <h1>Error!!! </h1>;
  }

  console.log(data);
  const { lessonSizeFilter, lessonActiveStatusFilter, lessonTitleFilter } = lessonSelector;

  const filteredData = data.payload.filter((lesson) => {
    const activeFilter = lessonActiveStatusFilter === 'active';
    return lesson.isActive === activeFilter
      && lesson.title.toLowerCase().includes(lessonTitleFilter.toLocaleLowerCase())
      && lessonSizeFilter;
  });

  if (sortBy) {
    // @ts-ignore
    filteredData.sort((objA, objB) => (sortOrder === 'asc' ? objB[sortBy] - objA[sortBy] : objA[sortBy] - objB[sortBy]));
  }

  const filteredRows = filteredData.map((lesson) => {
    const args = getRowArguments(lesson, isMobile, deleteLessonHandler);
    return createRow(lesson._id, args);
  });

  const rowsStartIdx = page === 0 ? 0 : page * rowsNumber;
  const rowsEndIdx = page === 0 ? rowsNumber : (page + 1) * rowsNumber;

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableHeader
              sortIds={new Set(['day', 'activeStudents'])}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
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
      <ConfirmationDialog
        title='Удалить занятие'
        contentEl={<DeleteDialogText name={lessonDetails?.title || ''} />}
        isOpen={isModalOpen}
        setModalOpen={setModalOpen}
      />
    </>
  );
}
