import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useEffect, useState } from 'react';
import { useGetUsersQuery, usePatchLessonMutation } from 'shared/api';

interface IChangeTeacherDialog {
  lessonId: string;
  lessonTitle: string;
  teacherName: string;
  teacherId: string;
  isOpen: boolean;
  setModalOpen: (value: boolean) => void;
}

interface IListTeachers {
  lessonTeacherId: string;
  setSelected: (value: string) => void;
}

function ListTeachers({ lessonTeacherId, setSelected }: IListTeachers) {
  const { data: teachers } = useGetUsersQuery();

  if (!teachers?.payload) {
    return <></>;
  }

  return (
    <RadioGroup
      onChange={(event: React.ChangeEvent<HTMLInputElement>, value: string) => setSelected(value)}
    >
      {
        teachers.payload
          .filter((teacher) => teacher._id !== lessonTeacherId)
          .map((teacher) => <FormControlLabel
            key={teacher._id}
            value={teacher._id}
            control={<Radio />}
            label={teacher.fullname}
          />)
    }
    </RadioGroup>
  );
}

export function ChangeTeacherDialog(
  {
    lessonId,
    lessonTitle,
    teacherId,
    teacherName,
    isOpen,
    setModalOpen,
  }: IChangeTeacherDialog,
) {
  const [selected, setSelected] = useState(teacherId);
  const [updateLesson, { isSuccess }] = usePatchLessonMutation();

  useEffect(() => {
    if (isSuccess) setModalOpen(false);
  }, [isSuccess]);

  const handleOk = () => {
    updateLesson({
      id: lessonId,
      newItem: {
        teacher: selected,
      },
    });
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <Dialog open={isOpen} maxWidth='xl' transitionDuration={500} onClose={() => setModalOpen(false)}>
      <DialogTitle>Заменить педагога</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Вы хотите заменить педагога <strong>{teacherName}</strong>
           в занятии <strong>{lessonTitle}</strong>.
         <p>Выберите нового педагога.</p>
        <Divider />
        <ListTeachers lessonTeacherId={teacherId} setSelected={setSelected} />

        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus variant='contained' color='error' onClick={handleCancel}>
          Закрыть
        </Button>
        <Button variant='contained' color='success' onClick={handleOk}>Подтвердить</Button>
      </DialogActions>
    </Dialog>
  );
}
