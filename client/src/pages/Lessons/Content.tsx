import { useState } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { TableHeader } from './ContentHeader';
import { useGetLessonsQuery, useDeleteLessonMutation } from '../../shared/api/lessonApi';
import { ILessonModel } from '../../shared/models/ILessonModel';
import { ConfirmationDialog, DeleteDialogText } from '../../shared/components/ConfirmationDialog';
import { getDayName } from '../../shared/helpers/getDayName';
import { getReadbleTime } from '../../shared/helpers/getReadableTime';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useMobile } from '../../shared/hooks/useMobile';

interface IAddRow {
  lesson: ILessonModel;
  args: (string | number | JSX.Element)[];
}

function AddRow({ lesson, args }: IAddRow) {
  const isMobile = useMobile();
  const [deleteLesson] = useDeleteLessonMutation();
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <TableRow key={lesson._id} hover={true}>
        { args.map((value) => <TableCell key={lesson._id + value}>{value}</TableCell>) }

        {!isMobile
         && <TableCell>
              <IconButton onClick={() => setModalOpen(true)}><DeleteIcon /></IconButton>
            </TableCell>
        }
      </TableRow>

      {!isMobile && <ConfirmationDialog
        title='Удалить занятие'
        contentEl={<DeleteDialogText name={lesson.title} />}
        isOpen={isModalOpen}
        setModalOpen={setModalOpen}
        callback={() => deleteLesson(lesson._id)}
      />}
    </>
  );
}

function getRowArguments(lesson: ILessonModel, isMobile: boolean) {
  if (isMobile) {
    return [
      lesson.title,
      lesson.activeStudents,
    ];
  }

  return ([
    lesson.title,
    getDayName(lesson.day),
    getReadbleTime(lesson.timeStart),
    'Группа', // TODO заменть на тип занятия - individual или group
    lesson.activeStudents,
    lesson.isActive ? 'Активна' : 'В архиве',
  ]);
}

export function LessonsContent() {
  const isMobile = useMobile();
  const [page, setPage] = useState(0);
  const [rowsNumber, setRowsNumbr] = useState(10);
  const [sortBy, setSortBy] = useState<'day' | 'activeStudents'>('day');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { data, isLoading, error } = useGetLessonsQuery();

  const titleFilter = useAppSelector((state) => state.lessonsPageReducer.titleFilter);
  const sizeFilter = useAppSelector((state) => state.lessonsPageReducer.sizeFilter);
  const statusFilter = useAppSelector((state) => state.lessonsPageReducer.statusFilter);

  if (isLoading || !data?.payload) {
    return null;
  }

  if (error) {
    return <h1>Error!!! </h1>;
  }

  const filteredData = data.payload.filter((lesson) => {
    const activeFilter = statusFilter === 'active';
    return lesson.isActive === activeFilter
      && lesson.title.toLowerCase().includes(titleFilter.toLocaleLowerCase())
      && sizeFilter;
  });

  if (sortBy) {
    filteredData.sort((objA, objB) => (sortOrder === 'asc' ? objB[sortBy] - objA[sortBy] : objA[sortBy] - objB[sortBy]));
  }

  const filteredRows = filteredData.map((lesson) => {
    const args = getRowArguments(lesson, isMobile);
    return <AddRow key={lesson._id} lesson={lesson} args={args} />;
  });

  const rowsStartIdx = page === 0 ? 0 : page * rowsNumber;
  const rowsEndIdx = page === 0 ? rowsNumber : (page + 1) * rowsNumber;

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableHeader
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
    </>
  );
}
