import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { format } from 'date-fns';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { DateField } from '../../shared/components/fields/DateField';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { attendancePageActions } from '../../shared/reducers/attendancePageSlice';
import { ILessonModel } from '../../shared/models/ILessonModel';
import { FormContentColumn } from '../../shared/components/FormContentColumn';
import { useGetAttendanceQuery } from '../../shared/api';
import { Loading } from '../../shared/components/Loading';

export function ShowPostponedLesson({ lesson }: { lesson: ILessonModel }) {
  const navigate = useNavigate();
  const actions = useActionCreators(attendancePageActions);

  const {
    editPostponedAttendanceStudentId,
    showPostponedAttendanceModalOpen,
  } = useAppSelector((state) => state.attendancePageReducer);

  const visitDetails = lesson.students
    .find((details) => details.student._id === editPostponedAttendanceStudentId);

  const { data: attendance, isLoading } = useGetAttendanceQuery(visitDetails?.visitInstead ?? '', {
    skip: !visitDetails?.visitInstead,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (!attendance) return null;

  const attendanceDate = new Date(attendance.date);

  const closeHandler = () => {
    actions.setShowPostponedAttendanceModalOpen(false);
  };

  // идем к занятию которое пропустил ученик
  const goToPostponedLesson = () => {
    closeHandler();
    navigate(`/attendances/history?year=${attendanceDate.getFullYear()}&month=${attendanceDate.getMonth() + 1}&day=${attendanceDate.getDate()}&lessonId=${attendance.lesson._id}`);
  };

  return (
    <Dialog
      open={showPostponedAttendanceModalOpen}
      onClose={closeHandler}
    >
      <DialogTitle pb={1}>Отработка для {visitDetails?.student?.fullname} вместо</DialogTitle>

      <DialogContent>
        <FormContentColumn>
          <TextField
            value={attendance?.lesson?.title}
            inputProps={{ readOnly: true }}
          />

          <DateField
            value={format(attendanceDate, 'yyyy-MM-dd')}
            name='date'
            label='Дата пропуска'
            inputProps={{ readOnly: true }}
          />
        </FormContentColumn>

        <DialogActions sx={{ paddingRight: '0' }}>
          <Button
            autoFocus
            variant='contained'
            color='error'
            onClick={closeHandler}
          >
            Закрыть
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={goToPostponedLesson}
          >
            К занятию
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
