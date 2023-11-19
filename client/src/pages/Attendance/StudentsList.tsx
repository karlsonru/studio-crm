import { FormEvent, ReactNode } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { VisitStatusButton } from './VisitStatusButton';
import { SubmitButton } from '../../shared/components/buttons/SubmitButton';
import { IStudentModel } from '../../shared/models/IStudentModel';
import { ILessonModel, VisitType } from '../../shared/models/ILessonModel';
import { useCreateAttendanceMutation, usePatchAttendanceMutation } from '../../shared/api';
import { MODAL_FORM_WIDTH } from '../../shared/constants';
import { BillingStatus, IAttendanceModel, VisitStatus } from '../../shared/models/IAttendanceModel';
import { getVisitTypeName } from '../../shared/helpers/getVisitTypeName';
import { getBillingStatusNameAndColor } from '../../shared/helpers/getBillingStatusNameAndColor';

interface IFormWrapper {
  children: ReactNode | Array<ReactNode>;
  submitHandler: (event: FormEvent<HTMLFormElement>) => void;
}

function FormWrapper({ children, submitHandler }: IFormWrapper) {
  return (
    <Box
      component="form"
      onSubmit={submitHandler}
      width="100%"
      maxWidth={MODAL_FORM_WIDTH}
    >

      {children}

      <SubmitButton
        content='Подтвердить'
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

interface IStudentsListItem {
  student: IStudentModel;
  visitDetails: {
    visitType: VisitType;
    visitStatus?: VisitStatus;
    billingStatus?: BillingStatus;
    visitInstead?: string;
  }
}

function StudentsListItem({ student, visitDetails }: IStudentsListItem) {
  const {
    visitType, visitStatus, billingStatus, visitInstead,
  } = visitDetails;
  const { name: billingStatusName, color } = getBillingStatusNameAndColor(billingStatus);
  const visitTypeName = getVisitTypeName(visitType);

  return (
    <ListItem divider={true}>
      <ListItemText
        primary={student.fullname}
        secondary={
          <List disablePadding>
            <ListItemText
              secondary={billingStatusName}
              secondaryTypographyProps={{ sx: { color } }}
            />
            <ListItemText
              secondary={visitTypeName}
            />
            {
              visitInstead && VisitType.POSTPONED && <ListItemText
                secondary={`Отработано в занятии ${visitInstead}`}
              />
            }
          </List>
        }
        secondaryTypographyProps={{
          component: 'div',
        }}
      />
      <VisitStatusButton
        studentId={student._id}
        visitStatus={visitStatus}
      />
    </ListItem>
  );
}

export function StudentsListVisited({ attendance }: { attendance: IAttendanceModel }) {
  const [updateAttendance] = usePatchAttendanceMutation();

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);

    const visitStatuses = Object.fromEntries(formData.entries());

    const visits = attendance.students.map((visited) => ({
      student: visited.student._id,
      visitType: visited.visitType,
      visitStatus: visitStatuses[visited.student._id] as VisitStatus,
      billingStatus: visited.billingStatus,
      subscription: visited.subscription,
    }));

    updateAttendance({
      id: attendance._id,
      newItem: {
        students: visits,
      },
    });
  };

  return (
    <FormWrapper submitHandler={submitHandler}>
      <List>
        {attendance.students.map(
          (visited) => <StudentsListItem
            key={visited.student._id}
            student={visited.student}
            visitDetails={{
              visitStatus: visited.visitStatus,
              visitType: visited.visitType,
              billingStatus: visited.billingStatus,
              visitInstead: visited.visitInstead,
            }}
          />,
        )}
      </List>
    </FormWrapper>
  );
}

interface IStudentsListFuture {
  lesson: ILessonModel;
  dateTimestamp: number;
}

export function StudentsListFuture({ lesson, dateTimestamp }: IStudentsListFuture) {
  const [createAttendance] = useCreateAttendanceMutation();

  const date = new Date(dateTimestamp);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);

    const visitStatuses = Object.fromEntries(formData.entries());

    const visits = lesson.students.map((visiting) => ({
      student: visiting.student._id,
      visitType: visiting.visitType,
      visitStatus: visitStatuses[visiting.student._id] as VisitStatus,
    }));

    createAttendance({
      lesson: lesson._id,
      teacher: lesson.teacher._id,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      weekday: lesson.day,
      students: visits,
    });
  };

  return (
    <FormWrapper submitHandler={submitHandler}>
      <List>
        {lesson.students.map(
          (visiting) => {
            // если студент однократный, то показываем его только за дату планируемого посещения
            if (visiting.visitType !== VisitType.REGULAR
              && visiting.date !== dateTimestamp) {
              return null;
            }

            return (
              <StudentsListItem
                key={visiting.student._id}
                student={visiting.student}
                visitDetails={{
                  visitType: visiting.visitType,
                }}
              />
            );
          },
        )}
      </List>
    </FormWrapper>
  );
}
