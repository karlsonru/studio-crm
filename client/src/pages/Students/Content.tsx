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
import { TableHeader } from './ContentHeader';
import { useGetStudentsQuery, useDeleteStudentMutation } from '../../shared/api/studentApi';
import { ConfirmationDialog, DeleteDialogText } from '../../shared/components/ConfirmationDialog';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { IStudentModel } from '../../shared/models/IStudentModel';

interface IRowArguments<T> {
  student: T;
  isMobile: boolean;
  deleteHandler: (student: T) => void;
}

function getRowArguments({ student, isMobile, deleteHandler }: IRowArguments<IStudentModel>) {
  if (isMobile) {
    return [student.fullname];
  }

  return ([
    student.fullname,
    student.contacts[0].phone,
    student.sex,
    student.birthday,
    student.isActive ? 'Активен' : 'В архиве',
    <IconButton onClick={() => deleteHandler(student)}><DeleteIcon /></IconButton>,
  ]);
}

function createRow(id: string, args: (string | number | JSX.Element)[]) {
  return (
    <TableRow key={id} hover={true}>
      { args.map((value) => <TableCell key={id + value}>{value}</TableCell>) }
    </TableRow>
  );
}

export function StudentsContent() {
  const isMobile = useMediaQuery('(max-width: 767px)');

  const sortBy = useAppSelector((state) => state.studentsPageReducer.sort.item);
  const sortOrder = useAppSelector((state) => state.studentsPageReducer.sort.order);

  const [isModalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsNumber, setRowsNumbr] = useState(10);
  const [studentDetails, setStudentDetails] = useState<IStudentModel>();

  const deleteHandler = useCallback((currentStudent: IStudentModel) => {
    setStudentDetails(currentStudent);
    setModalOpen(true);
  }, [setModalOpen, setStudentDetails]);

  const { data, isLoading, error } = useGetStudentsQuery();
  const [deleteStudent] = useDeleteStudentMutation();

  const filters = useAppSelector((state) => state.studentsPageReducer.filters);

  if (isLoading || !data?.payload) {
    return null;
  }

  if (error) {
    return <h1>Error!!! </h1>;
  }

  const filteredData = data.payload.filter((student) => {
    const age = new Date(Date.now() - +(new Date(student.birthday))).getFullYear();
    return (
      (filters.status ? student.isActive === (filters.status === 'active') : true)
      && (filters.fullname
        ? student.fullname.toLowerCase().includes(filters.fullname.toLocaleLowerCase())
        : true)
      && (filters.phone
        ? student.contacts.some((contact) => contact.phone.toString().includes(filters.phone))
        : true)
      // TODO: получилась монструозная функция фильтра. Подумать над упрощением
      && (filters.lessons.length
        ? filters.lessons.filter(
          (lesson) => student.visitingLessons.some((les) => les._id === lesson.id),
        ).length
        : true)
      && (filters.ageFrom ? age >= filters.ageFrom : true)
      && (filters.ageTo ? age <= filters.ageTo : true)
    );
  });

  if (sortBy) {
    // @ts-ignore
    filteredData.sort((objA, objB) => (sortOrder === 'asc' ? objB[sortBy] - objA[sortBy] : objA[sortBy] - objB[sortBy]));
  }

  const filteredRows = filteredData.map((student) => {
    const args = getRowArguments({ student, isMobile, deleteHandler });
    return createRow(student._id, args);
  });

  const rowsStartIdx = page === 0 ? 0 : page * rowsNumber;
  const rowsEndIdx = page === 0 ? rowsNumber : (page + 1) * rowsNumber;

  return (
    <>
      <TableContainer>
        <Table>

          <TableHead>
            <TableHeader />
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

      {
        studentDetails
        && <ConfirmationDialog
            title='Удалить занятие'
            contentEl={<DeleteDialogText name={studentDetails.fullname} />}
            isOpen={isModalOpen}
            setModalOpen={setModalOpen}
            callback={() => deleteStudent(studentDetails._id)}
          />
      }
    </>
  );
}
