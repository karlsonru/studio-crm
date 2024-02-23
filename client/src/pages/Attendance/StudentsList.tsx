import { FormEvent, ReactNode } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { VisitStatusButton } from './VisitStatusButton';
import { SubmitButton } from '../../shared/components/buttons/SubmitButton';
import { IStudentModel } from '../../shared/models/IStudentModel';
import { ILessonModel, IVisitingStudent, VisitType } from '../../shared/models/ILessonModel';
import { useCreateAttendanceMutation, usePatchAttendanceMutation } from '../../shared/api';
import { MODAL_FORM_WIDTH } from '../../shared/constants';
import {
  PaymentStatus,
  IAttendanceModel,
  VisitStatus,
  IVisit,
} from '../../shared/models/IAttendanceModel';
import { getVisitTypeName } from '../../shared/helpers/getVisitTypeName';
import { getBillingStatusNameAndColor } from '../../shared/helpers/getBillingStatusNameAndColor';
import { useAppSelector } from '../../shared/hooks/useAppSelector';

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
    paymentStatus?: PaymentStatus;
    visitInstead?: string;
  }
}

function StudentsListItem({ student, visitDetails }: IStudentsListItem) {
  const {
    visitType,
    visitStatus,
    paymentStatus,
    visitInstead,
  } = visitDetails;

  const { name: paymentStatusName, color } = getBillingStatusNameAndColor(paymentStatus);
  const visitTypeName = getVisitTypeName(visitType);

  return (
    <ListItem divider={true}>
      <ListItemText
        primary={student.fullname}
        secondary={
          <List disablePadding>
            <ListItemText
              secondary={paymentStatusName}
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

function DisplayNumberOfVisited({ attendance }: { attendance: IAttendanceModel }) {
  const { students } = attendance;
  const visited = students.filter(
    (student) => (student.visitStatus === VisitStatus.VISITED),
  ).length;

  return (
    <ListItem sx={{ textAlign: 'right' }}>
      <ListItemIcon>
        <PersonOutlineOutlinedIcon />
      </ListItemIcon>
      <ListItemText
        primary={`Посетило ${visited} из ${students.length}`}
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
      paymentStatus: visited.paymentStatus,
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
    <FormWrapper
      submitHandler={submitHandler}
    >
      <List>
        {attendance.students.map(
          (visited) => <StudentsListItem
            key={visited.student._id}
            student={visited.student}
            visitDetails={{
              visitStatus: visited.visitStatus,
              visitType: visited.visitType,
              paymentStatus: visited.paymentStatus,
              visitInstead: visited.visitInstead,
            }}
          />,
        )}

        <DisplayNumberOfVisited attendance={attendance} />
      </List>
    </FormWrapper>
  );
}

interface IStudentsListFuture {
  lesson: ILessonModel;
  studentsFromFuture?: Array<IVisit>;
}

function isAttendanceStudent(obj: IVisit | IVisitingStudent): obj is IVisit {
  return 'paymentStatus' in obj && 'visitStatus' in obj;
}

export function StudentsListFuture({ lesson, studentsFromFuture }: IStudentsListFuture) {
  const [createAttendance] = useCreateAttendanceMutation();
  const searchDateTimestamp = useAppSelector(
    (state) => state.attendancePageReducer.searchDateTimestamp,
  );

  const students = lesson.students.filter(
    (student) => student.visitType === VisitType.REGULAR || student.date === searchDateTimestamp,
  );

  const studentsList = studentsFromFuture ? [...students, ...studentsFromFuture] : students;

  const date = new Date(searchDateTimestamp);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);

    const visitStatuses = Object.fromEntries(formData.entries());

    const visits = studentsList.map((visiting) => ({
      ...visiting,
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
        {studentsList.map(
          (visiting) => <StudentsListItem
            key={visiting.student._id}
            student={visiting.student}
            visitDetails={{
              ...visiting,
              visitType: visiting.visitType,
              visitStatus: (isAttendanceStudent(visiting) && visiting.visitStatus) || undefined,
              paymentStatus: (isAttendanceStudent(visiting) && visiting.paymentStatus) || undefined,
              visitInstead: visiting.visitInstead,
            }}
          />,
        )
        }
      </List>
    </FormWrapper>
  );
}
