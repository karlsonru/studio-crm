import { List } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
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

  console.log('listTeachers');
  console.log(teachers);

  if (!teachers?.payload) {
    return <></>;
  }

  return (
    <List>
      {
        teachers.payload
          .filter((teacher) => teacher._id !== lessonTeacherId)
          .map((teacher) => <ListItem key={teacher._id}>
            <ListItemButton onClick={() => setSelected(teacher._id)}>
              {teacher.fullname}
            </ListItemButton>
          </ListItem>)
      }
    </List>
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
          Выберите нового педагога.
        </DialogContentText>

        <ListTeachers lessonTeacherId={teacherId} setSelected={setSelected} />

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
