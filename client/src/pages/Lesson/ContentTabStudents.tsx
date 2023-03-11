import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography/Typography';
import Stack from '@mui/system/Stack';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import SyncIcon from '@mui/icons-material/Sync';
import { ChangeTeacherDialog } from './ChangeTeacherDialog';
import { useMobile } from '../../shared/hooks/useMobile';
import { useFindStudentsMutation, useGetLessonQuery } from '../../shared/api';
import { ConfirmationDialog, DeleteDialogText } from '../../shared/components/ConfirmationDialog';
import { IStudentModel } from '../../shared/models/IStudentModel';

interface IContentStudents {
  lessonId: string;
}

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
  cardDetails: IStudentModel;
}

function AddCard({ lessonId, cardDetails }: IAddCard) {
  const isMobile = useMobile();

  // TODO должна быть функцция удаления студента из группы
  // Удаляется запись у студента о вхождении в группы,
  // запись у active абонемента становится null,
  // у lesson студент удаляется из массива ?
  // скорее всего нужен запрос к lesson + trx транзакция на backend
  const excludeHandler = () => {
    console.log(`Исключён с занятия ${lessonId}`);
  };

  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Card variant="outlined" sx={{ width: '325px', marginRight: isMobile ? 0 : '0.5rem', marginBottom: '0.5rem' }}>
        <CardHeader title={cardDetails.fullname} action={
          <IconButton onClick={() => setModalOpen(true)}>
            <RemoveCircleOutlineIcon />
          </IconButton>
          } />
        <CardContent>
          <CardContentItem title="Контакт" value={cardDetails.contacts[0].name} />
          <Divider />
          <CardContentItem title="Телефон" value={cardDetails.contacts[0].phone} />
          <Divider />
        </CardContent>
      </Card>

      <ConfirmationDialog
        title='Исключить из группы'
        contentEl={<DeleteDialogText name={cardDetails.fullname} />}
        isOpen={isModalOpen}
        setModalOpen={setModalOpen}
        callback={() => excludeHandler()}
      />
    </>
  );
}

export function ContentStudents({ lessonId }: IContentStudents) {
  const isMobile = useMobile();
  const [isModalOpen, setModalOpen] = useState(false);
  const [findStudents, { data, isLoading, isError }] = useFindStudentsMutation();
  const { data: lessonData } = useGetLessonQuery(lessonId);

  useEffect(() => {
    findStudents({
      lesson: lessonId,
      visitingLessons: lessonId,
    });
  }, []);

  if (isError) {
    return <h3>Ошибка при запросе!</h3>;
  }

  if (isLoading) {
    return <h3>Загружаем ...</h3>;
  }

  if (!data?.payload.length) {
    return <h3>Не найдено</h3>;
  }

  // TODO - добавить телефон педагога и выводить его в карточке
  // Для карточки педагога - замена педагога в занятии

  if (!lessonData) {
    return <h3>Нет педагога</h3>;
  }

  return (
    <>
      <Typography mb="1rem" variant="h5" component={'h5'}>Ученики</Typography>
      <Grid container direction="row">
        { data.payload.map(
          (student) => <AddCard key={student._id} lessonId={lessonId} cardDetails={student} />,
        )}
      </Grid>

      <Divider sx={{ m: '1rem 0' }} />

      <Typography mb="1rem" variant="h5" component={'h5'}>Педагог</Typography>
      <Card variant="outlined" sx={{ width: '325px', marginRight: isMobile ? 0 : '0.5rem', marginBottom: '0.5rem' }}>
        <CardHeader title={lessonData.payload.teacher.fullname} action={
          <IconButton onClick={() => setModalOpen(true)}>
            <SyncIcon />
          </IconButton>
          } />
        <CardContent>
          <CardContentItem title="Телефон" value={lessonData?.payload.teacher.login} />
        </CardContent>
      </Card>

      <ChangeTeacherDialog
        lessonId={lessonData.payload._id}
        lessonTitle={lessonData.payload.title}
        teacherId={lessonData.payload.teacher._id}
        teacherName={lessonData.payload.teacher.fullname}
        isOpen={isModalOpen}
        setModalOpen={setModalOpen}
      />

    </>
  );
}
