import { useState } from 'react';
import Typography from '@mui/material/Typography/Typography';
import Stack from '@mui/system/Stack';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import SyncIcon from '@mui/icons-material/Sync';
import { ChangeTeacherDialog } from './ChangeTeacherDialog';
import { useMobile } from '../../shared/hooks/useMobile';
import { useGetLessonQuery, usePatchLessonMutation } from '../../shared/api';
import { ConfirmationDialog, DeleteDialogText } from '../../shared/components/ConfirmationDialog';
import { IStudentModel } from '../../shared/models/IStudentModel';
import { AddStudentButton } from './AddStudentDialog';

function CardContentItem({ title, value }: { title: string, value: string | number }) {
  return (
    <Stack direction="row" justifyContent="space-between" my={1} >
      <Typography>
        { title }
      </Typography>
      <Typography sx={{ fontWeight: 'bold' }}>
        { value }
      </Typography>
  </Stack>
  );
}

interface IAddCard {
  lessonId: string;
  student: IStudentModel;
}

function AddCard({ lessonId, student }: IAddCard) {
  const isMobile = useMobile();
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
      <Card variant="outlined" sx={{ width: '325px', marginRight: isMobile ? 0 : '0.5rem', marginBottom: '0.5rem' }}>
        <CardHeader title={student.fullname} action={
          <IconButton onClick={() => setModalOpen(true)}>
            <RemoveCircleOutlineIcon />
          </IconButton>
          } />
        <CardContent>
          <CardContentItem title="Контакт" value={student.contacts[0].name} />
          <Divider />
          <CardContentItem title="Телефон" value={student.contacts[0].phone} />
          <Divider />
        </CardContent>
      </Card>

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

export function ContentStudents({ lessonId }: { lessonId: string }) {
  const isMobile = useMobile();
  const [isModalOpen, setModalOpen] = useState(false);
  const { data, isError, isFetching } = useGetLessonQuery(lessonId);

  if (isError) {
    return <h3>Ошибка при запросе!</h3>;
  }

  if (isFetching || !data?.payload) {
    return null;
  }

  // TODO - добавить телефон педагога и выводить его в карточке

  return (
    <>
      <Typography mb="1rem" variant="h5" component={'h5'}>Ученики</Typography>
      <Grid container direction="row">
        {
          data?.payload.students.map(
            (student) => <AddCard key={student._id} lessonId={lessonId} student={student} />,
          )
        }
        <AddStudentButton lessonId={lessonId} />
      </Grid>

      <Divider sx={{ m: '1rem 0' }} />

      <Typography mb="1rem" variant="h5" component={'h5'}>Педагог</Typography>

      <Card
        variant="outlined"
        sx={{
          width: '325px',
          marginRight: isMobile ? 0 : '0.5rem',
          marginBottom: '0.5rem',
        }}>

        <CardHeader
          title={data.payload.teacher.fullname}
          action={
            <IconButton onClick={() => setModalOpen(true)}>
              <SyncIcon />
            </IconButton>
          } />

        <CardContent>
          <CardContentItem
            title="Телефон"
            value={data.payload.teacher.login} />
        </CardContent>

      </Card>

      <ChangeTeacherDialog
        lesson={data.payload}
        isOpen={isModalOpen}
        setModalOpen={setModalOpen}
      />

    </>
  );
}
