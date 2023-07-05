import { FormEvent } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { VisitStatusButton } from './VisitStatusButton';
import { SubmitButton } from '../../shared/components/buttons/SubmitButton';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { IStudentModel } from '../../shared/models/IStudentModel';
import { ILessonModel, VisitType } from '../../shared/models/ILessonModel';
import {
  useGetLessonQuery,
  useCreateAttendanceMutation,
  useFindAttendancesQuery,
  usePatchAttendanceMutation,
} from '../../shared/api';
import { MODAL_FORM_WIDTH } from '../../shared/constants';
import { BillingStatus, VisitStatus } from '../../shared/models/IAttendanceModel';

interface IStudentsListItem {
  student: IStudentModel;
  visitDetails?: {
    visitStatus?: VisitStatus;
    billingStatus?: BillingStatus;
    visitType?: VisitType;
  }
}

function getVisitTypeName(visitType?: VisitType) {
  switch (visitType) {
    case VisitType.REGULAR:
      return 'Постоянно';
    case VisitType.MISSED_REGULAR:
      return 'Отработка';
    case VisitType.NEW:
      return 'Новый';
    case VisitType.SINGLE:
      return 'Однократно';
    default:
      return 'Неизвестно';
  }
}

function getBillingStatusNameAndColor(billingStatus?: BillingStatus) {
  switch (billingStatus) {
    case BillingStatus.PAID:
      return {
        name: 'Оплачено',
        color: 'success.main',
      };
    case BillingStatus.UNPAID:
      return {
        name: 'Неоплачено',
        color: 'error.main',
      };
    default:
      return {
        name: 'Нет информации',
        color: 'default',
      };
  }
}

interface IStudentBillingStatusAndVisitType {
  billingStatus: string;
  visitType: string;
}

function StudentBillingStatusAndVisitType({
  billingStatus, visitType,
}: IStudentBillingStatusAndVisitType) {
  return (
    <List disablePadding>
      <ListItem disablePadding>
        <ListItemText secondary={visitType} />
      </ListItem>
      <ListItem disablePadding>
        <ListItemText secondary={billingStatus} />
      </ListItem>
    </List>
  );
}

function StudentsListItem({ student, visitDetails }: IStudentsListItem) {
  const { visitStatus, billingStatus, visitType } = visitDetails ?? {};
  const { name: billingStatusName, color } = getBillingStatusNameAndColor(billingStatus);
  const visitTypeName = getVisitTypeName(visitType);

  return (
    <ListItem divider={true}>
      <ListItemText
        primary={student.fullname}
        secondary={
          <StudentBillingStatusAndVisitType
            billingStatus={billingStatusName}
            visitType={visitTypeName}
          />
        }
        secondaryTypographyProps={{ sx: { color } }}
      />
      <VisitStatusButton studentId={student._id} visitStatus={visitStatus} />
    </ListItem>
  );
}

function StudentsListVisited({ lessonId }: { lessonId: string }) {
  const date = useAppSelector(
    (state) => state.visitsPageReducer.currentDateTimestamp,
  );

  const { data } = useFindAttendancesQuery({
    $and: [
      { lesson: lessonId },
      { date },
    ],
  }, {
    selectFromResult: (result) => ({ data: result.data }),
  });

  if (!data) return null;

  return (
    <List>
      {data[0].students.map(
        (visit) => <StudentsListItem
          key={visit.student._id}
          student={visit.student}
          visitDetails={{
            visitStatus: visit.visitStatus,
            visitType: visit.visitType,
            billingStatus: visit.billingStatus,
          }}
        />,
      )}
    </List>
  );
}

function StudentsListFuture({ lessonId }: { lessonId: string }) {
  const { data } = useGetLessonQuery(lessonId, {
    selectFromResult: (result) => ({ data: result.data }),
  });

  if (!data) return null;

  return (
    <List>
      {data.students.map(
        (visiting) => <StudentsListItem
          key={visiting.student._id}
          student={visiting.student}
          visitDetails={{
            visitType: visiting.visitType,
          }}
        />,
      )}
    </List>
  );
}

interface IStudentsList {
  lesson: ILessonModel,
  visitedLessonId?: string;
  dateTimestamp: number;
}

export function StudentsList({
  lesson, visitedLessonId, dateTimestamp,
}: IStudentsList) {
  const [updateAttendance] = usePatchAttendanceMutation();
  const [createAttendance] = useCreateAttendanceMutation();

  const visits = useAppSelector((state) => state.visitsPageReducer.visits);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (visitedLessonId) {
      updateAttendance({
        id: visitedLessonId,
        newItem: {
          students: visits,
        },
      });
    } else {
      createAttendance({
        lesson: lesson._id,
        teacher: lesson.teacher._id,
        day: lesson.day,
        date: dateTimestamp,
        students: visits,
      });
    }
  };

  return (
    <Box component="form" onSubmit={submitHandler} width="100%" maxWidth={MODAL_FORM_WIDTH}>

      { visitedLessonId && <StudentsListVisited lessonId={lesson._id} /> }
      { !visitedLessonId && <StudentsListFuture lessonId={lesson._id} /> }

      <SubmitButton
        content={visitedLessonId ? 'Обновить' : 'Отметить'}
        props={{
          sx: {
            float: 'right',
            marginRight: '1rem',
          },
        }}
      />
    </Box>
  );
}
