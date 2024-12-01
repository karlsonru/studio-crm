import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { format } from 'date-fns';
import { FormEvent } from 'react';
import { useGetLessonQuery, usePatchAttendnceStudentByIdMutation } from '../../shared/api';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { DateField } from '../../shared/components/fields/DateField';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { attendancePageActions } from '../../shared/reducers/attendancePageSlice';
import { IAttendanceModel } from '../../shared/models/IAttendanceModel';
import { FormContentColumn } from '../../shared/components/FormContentColumn';
import { SubmitButton } from '../../shared/components/buttons/SubmitButton';
import { getErrorMessage } from '../../shared/helpers/getErrorMessage';

export function ShowPostponedAttendance({ attendance }: { attendance: IAttendanceModel }) {
  const actions = useActionCreators(attendancePageActions);
  const [updateAttendanceStudentById, requestStatus] = usePatchAttendnceStudentByIdMutation();
  const navigate = useNavigate();

  const {
    editPostponedAttendanceStudentId,
    showPostponedAttendanceModalOpen,
  } = useAppSelector((state) => state.attendancePageReducer);

  const visitDetails = attendance.students
    .find((details) => details.student._id === editPostponedAttendanceStudentId);

  const student = visitDetails?.student;
  const lessonId = visitDetails?.visitInstead;

  const { data: lesson } = useGetLessonQuery(lessonId ?? '', {
    skip: !lessonId,
  });

  if (!lesson) {
    return null;
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // удалим отработку у студента
    updateAttendanceStudentById({
      id: attendance._id,
      path: `student/${editPostponedAttendanceStudentId}/remove`,
      newItem: { ...visitDetails },
    });
  };

  const closeHandler = () => {
    actions.setShowPostponedAttendanceModalOpen(false);
  };

  const visitInsteadDate = new Date(visitDetails?.visitInsteadDate ?? Date.now());

  const goToPostponedLesson = () => {
    closeHandler();
    navigate(`/attendances/history?year=${visitInsteadDate.getFullYear()}&month=${visitInsteadDate.getMonth() + 1}&day=${visitInsteadDate.getDate()}&lessonId=${lessonId}`);
  };

  return (
    <Dialog
      open={showPostponedAttendanceModalOpen}
      onClose={closeHandler}
    >
      <DialogTitle pb={1}>Назначена отработка для {student?.fullname}</DialogTitle>

      {requestStatus.isSuccess && <DialogTitle
        color="success.main"
        variant='subtitle1'
        sx={{ py: 1 }}
        >
          Успешно!
        </DialogTitle>
      }

      {requestStatus.isError && <DialogTitle
          color="error"
          variant='subtitle1'
        >
          {`Не удалось :( ${getErrorMessage(requestStatus.error)}`}
        </DialogTitle>
      }

      <DialogContent>
        <Box
          component='form'
          onSubmit={onSubmit}
        >
          <FormContentColumn>
            <TextField
              value={lesson.title}
              inputProps={{ readOnly: true }}
            />

            <DateField
              value={format(visitInsteadDate, 'yyyy-MM-dd')}
              name='date'
              label='Дата отработки'
              inputProps={{ readOnly: true }}
            />
          </FormContentColumn>

          <DialogActions sx={{ paddingRight: '0' }}>
            <Button
              color='primary'
              onClick={goToPostponedLesson}
            >
              Перейти
            </Button>
            <Button
              autoFocus
              variant='contained'
              color='error'
              onClick={closeHandler}
            >
              Закрыть
            </Button>
            <SubmitButton
              content={'Отменить'}
              props={{
                disabled: requestStatus.isLoading,
                color: 'primary',
              }}
            />
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
