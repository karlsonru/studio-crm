import { useState } from 'react';
import Typography from '@mui/material/Typography/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import SyncIcon from '@mui/icons-material/Sync';
import { ChangeTeacherDialog } from './ChangeTeacherDialog';
import { usePatchLessonMutation } from '../../shared/api';
import { ConfirmationDialog, DeleteDialogText } from '../../shared/components/ConfirmationDialog';
import { IStudentModel } from '../../shared/models/IStudentModel';
import { AddStudentButton, AddStudentsDialog } from './AddStudentDialog';
import { ILessonModel } from '../../shared/models/ILessonModel';
import { CardWrapper } from '../../shared/components/CardWrapper';
import { CardContentItem } from '../../shared/components/CardContentItem';

interface IAddCard {
  lessonId: string;
  student: IStudentModel;
}

function AddCard({ lessonId, student }: IAddCard) {
  const [updateLesson] = usePatchLessonMutation();

  const excludeHandler = () => {
    updateLesson({
      id: lessonId,
      newItem: {
        // @ts-ignore
        $pull: {
          students: student._id,
        },
      },
    });
  };

  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <CardWrapper>
        <CardHeader
          title={student.fullname}
          action={
            <IconButton onClick={() => setModalOpen(true)}>
              <RemoveCircleOutlineIcon />
            </IconButton>
            }
          />
        <CardContent>
          <CardContentItem title="Контакт" value={student.contacts[0].name} />
          <Divider />
          <CardContentItem title="Телефон" value={student.contacts[0].phone} />
          <Divider />
        </CardContent>
      </CardWrapper>

      <ConfirmationDialog
        title='Исключить из группы'
        contentEl={<DeleteDialogText name={student.fullname} />}
        isOpen={isModalOpen}
        setModalOpen={setModalOpen}
        callback={() => excludeHandler()}
      />
    </>
  );
}

export function ContentStudents({ lesson }: { lesson: ILessonModel }) {
  const [isChangeTeacher, setChangeTeacher] = useState(false);
  const [isAddStudent, setAddStudent] = useState(false);

  return (
    <>
      <Typography mb="1rem" variant="h5" component={'h5'}>Ученики</Typography>
      <Grid container direction="row">
        {
          lesson
            .students
            .map((visiting) => (
              <AddCard
                key={visiting.student._id}
                lessonId={lesson._id}
                student={visiting.student}
              />
            ))
        };

        <AddStudentButton setModalOpen={setAddStudent} />

        <AddStudentsDialog
          lesson={lesson}
          isOpen={isAddStudent}
          setModalOpen={setAddStudent}
        />
      </Grid>

      <Divider sx={{ m: '1rem 0' }} />
      <Typography mb="1rem" variant="h5" component={'h5'}>Педагог</Typography>

      <CardWrapper>
        <CardHeader
          title={lesson.teacher.fullname}
          action={
            <IconButton onClick={() => setChangeTeacher(true)}>
              <SyncIcon />
            </IconButton>
          } />

        <CardContent>
          <CardContentItem
            title="Телефон"
            value={lesson.teacher.phone} />
        </CardContent>
      </CardWrapper>

      <ChangeTeacherDialog
        lesson={lesson}
        isOpen={isChangeTeacher}
        setModalOpen={setChangeTeacher}
      />
    </>
  );
}
