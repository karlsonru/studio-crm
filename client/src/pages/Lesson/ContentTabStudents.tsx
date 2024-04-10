import { useState } from 'react';
import { format } from 'date-fns';
import Typography from '@mui/material/Typography/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import SyncIcon from '@mui/icons-material/Sync';
import { usePatchLessonStudentsMutation } from '../../shared/api';
import { ConfirmationDialog, DeleteDialogText } from '../../shared/components/ConfirmationDialog';
import { AddStudentButton, AddStudentsDialog } from './AddStudentDialog';
import { ILessonModel, IVisitingStudent, VisitType } from '../../shared/models/ILessonModel';
import { CardWrapper } from '../../shared/components/CardWrapper';
import { CardContentItem } from '../../shared/components/CardContentItem';
import { getVisitTypeName } from '../../shared/helpers/getVisitTypeName';
import { getTodayTimestamp } from '../../shared/helpers/getTodayTimestamp';
import { ChangeTeacherDialog } from '../../shared/components/ChangeTeacherDialog';

interface IStudentCard {
  lessonId: string;
  visiting: IVisitingStudent;
}

function getBorderStyle(visitType: VisitType, isOutdated: boolean) {
  const borderStyle = {
    outdated: { borderColor: 'error.main', opacity: 0.5 },
    single: { borderColor: 'warning.main', opacity: 0.75 },
    default: { borderColor: 'rgba(0, 0, 0, 0.12)', opacity: 1 },
  };

  if (visitType === VisitType.REGULAR) return borderStyle.default;

  if (isOutdated) return borderStyle.outdated;

  return borderStyle.single;
}

function StudentCard({ lessonId, visiting }: IStudentCard) {
  const [updateLessonStudents] = usePatchLessonStudentsMutation();

  const excludeHandler = () => {
    updateLessonStudents({
      id: lessonId,
      action: 'remove',
      newItem: {
        students: [visiting.student._id],
      },
    });
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const visitType = visiting.date === null
    ? getVisitTypeName(visiting.visitType)
    : `${getVisitTypeName(visiting.visitType)} ${format(visiting.date, 'dd.MM')}`;

  const isOutdated = visiting.date !== null && visiting.date < getTodayTimestamp();
  const borderStyle = getBorderStyle(visiting.visitType, isOutdated);

  return (
    <>
      <CardWrapper extraStyle={borderStyle}>
        <CardHeader
          title={visiting.student.fullname}
          action={
            <IconButton onClick={() => setModalOpen(true)}>
              <RemoveCircleOutlineIcon />
            </IconButton>
            }
          />
        <CardContent>
          <CardContentItem title="Контакт" value={visiting.student.contacts[0].name} />
          <Divider />
          <CardContentItem title="Телефон" value={visiting.student.contacts[0].phone} />
          <Divider />
          <CardContentItem title="Посещение" value={visitType} />
          <Divider />
        </CardContent>
      </CardWrapper>

      <ConfirmationDialog
        title='Исключить из группы'
        contentEl={<DeleteDialogText name={visiting.student.fullname} />}
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
              <StudentCard
                key={visiting.student._id}
                lessonId={lesson._id}
                visiting={visiting}
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
