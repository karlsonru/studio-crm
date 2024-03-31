import { FormEvent, ReactNode, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { VisitStatusButton } from './VisitStatusButton';
import { AddStudentsDialog } from './AddStudentDialog';
import { EditPostponedAttendance } from './EditPostponedAttendance';
import { ShowPostponedAttendance } from './ShowPostponedAttendance';
import { ShowPostponedLesson } from './ShowPostponedLesson';
import { SubmitButton } from '../../shared/components/buttons/SubmitButton';
import { IStudentModel } from '../../shared/models/IStudentModel';
import { ILessonModel, VisitType } from '../../shared/models/ILessonModel';
import { useCreateAttendanceMutation, usePatchAttendanceMutation } from '../../shared/api';
import { MODAL_FORM_WIDTH } from '../../shared/constants';
import {
  PaymentStatus,
  IAttendanceModel,
  VisitStatus,
  IAttendanceDetails,
} from '../../shared/models/IAttendanceModel';
import { getVisitTypeName } from '../../shared/helpers/getVisitTypeName';
import { getBillingStatusNameAndColor } from '../../shared/helpers/getBillingStatusNameAndColor';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { PrimaryButton } from '../../shared/components/buttons/PrimaryButton';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { attendancePageActions } from '../../shared/reducers/attendancePageSlice';

interface IFormWrapper {
  children: ReactNode | Array<ReactNode>;
  submitHandler: (event: FormEvent<HTMLFormElement>) => void;
  secondaryButton?: ReactNode;
}

function FormWrapper({ children, submitHandler, secondaryButton }: IFormWrapper) {
  return (
    <Box
      component="form"
      onSubmit={submitHandler}
      width="100%"
      maxWidth={MODAL_FORM_WIDTH}
    >
      {children}

      <Stack direction="row-reverse" justifyContent="space-between">
        <SubmitButton content='Подтвердить' />

        {secondaryButton}
      </Stack>
    </Box>
  );
}

interface IVisitDetails {
  visitType: VisitType;
  visitStatus?: VisitStatus;
  paymentStatus?: PaymentStatus;
  visitInstead?: string;
}

interface IStudentsListItem {
  student: IStudentModel;
  visitDetails: IVisitDetails;
}

function StudentsListItem({ student, visitDetails }: IStudentsListItem) {
  const actions = useActionCreators(attendancePageActions);
  const {
    visitType,
    visitStatus,
    paymentStatus,
    visitInstead,
  } = visitDetails;

  const { name: paymentStatusName, color } = getBillingStatusNameAndColor(paymentStatus);
  const visitTypeName = getVisitTypeName(visitType);
  const isPostponed = visitStatus === VisitStatus.POSTPONED_FUTURE
                    || visitStatus === VisitStatus.POSTPONED_DONE;
  const isPostponedVisitArranged = visitInstead ?? false;

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
          </List>
        }
        secondaryTypographyProps={{
          component: 'div',
        }}
      />
      {
        isPostponedVisitArranged && <IconButton
          onClick={() => {
            actions.setShowPostponedAttendanceModalOpen(true);
            actions.setEditPostponedAttendanceStudentId(student._id);
          }}
        >
          <EditCalendarIcon color="primary" />
        </IconButton>
      }
      {
        isPostponed && !isPostponedVisitArranged && <IconButton
          onClick={() => {
            actions.setEditPostponedAttendanceModalOpen(true);
            actions.setEditPostponedAttendanceStudentId(student._id);
          }}
        >
          <EditCalendarIcon color="primary" />
        </IconButton>
      }
      <VisitStatusButton
        studentId={student._id}
        visitStatus={visitStatus}
        visitType={visitType}
        isLocked={Boolean(visitInstead) && visitType !== VisitType.POSTPONED}
      />
    </ListItem>
  );
}

interface IStudentAndVisitDetails extends IVisitDetails {
  student: IStudentModel;
}

function ListStudents({ students }: { students: Array<IStudentAndVisitDetails> }) {
  return (
    <List>
      {students.map(
        (studentAndVisitDteails) => <StudentsListItem
          key={studentAndVisitDteails.student._id}
          student={studentAndVisitDteails.student}
          visitDetails={{
            visitType: studentAndVisitDteails.visitType,
            visitStatus: studentAndVisitDteails.visitStatus,
            paymentStatus: studentAndVisitDteails.paymentStatus,
            visitInstead: studentAndVisitDteails.visitInstead,
          }}
        />,
      )}
    </List>
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

function createVisitDetails(
  studentsAndVisitDetails: Array<IStudentAndVisitDetails>,
  formData: FormData,
) {
  const visitStatuses = Object.fromEntries(formData.entries());

  return studentsAndVisitDetails.map((visitDetails) => ({
    ...visitDetails,
    student: visitDetails.student._id,
    visitType: visitDetails.visitType,
    visitStatus: visitStatuses[visitDetails.student._id] as VisitStatus,
    paymentStatus: visitDetails.paymentStatus,
    visitInstead: visitDetails.visitInstead,
  }));
}

export function StudentsListAttendance({ attendance }: { attendance: IAttendanceModel }) {
  const [updateAttendance] = usePatchAttendanceMutation();
  const [isAddStudentModalOpen, setAddStudentModalOpen] = useState(false);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);

    updateAttendance({
      id: attendance._id,
      newItem: {
        students: createVisitDetails(attendance.students, formData),
      },
    });
  };

  return (
    <>
      <FormWrapper
        submitHandler={submitHandler}
        secondaryButton={
          <PrimaryButton
            content="Добавить"
            props={{ onClick: () => setAddStudentModalOpen(true) }}
          />
        }>
          <ListStudents students={attendance.students} />
          <DisplayNumberOfVisited attendance={attendance} />
      </FormWrapper>

      <AddStudentsDialog
        attendance={attendance}
        isOpen={isAddStudentModalOpen}
        setOpen={setAddStudentModalOpen}
      />

      <EditPostponedAttendance attendance={attendance} />
      <ShowPostponedAttendance attendance={attendance} />
    </>
  );
}

interface IStudentsListLesson {
  lesson: ILessonModel;
  studentsFromFutureAttendance?: Array<IAttendanceDetails>;
}

export function StudentsListLesson({ lesson, studentsFromFutureAttendance }: IStudentsListLesson) {
  const [createAttendance] = useCreateAttendanceMutation();
  const searchDateTimestamp = useAppSelector(
    (state) => state.attendancePageReducer.searchDateTimestamp,
  );

  const students = lesson.students.filter(
    (student) => student.visitType === VisitType.REGULAR || student.date === searchDateTimestamp,
  );

  const studentsList = studentsFromFutureAttendance
    ? [...students, ...studentsFromFutureAttendance]
    : students;

  const date = new Date(searchDateTimestamp);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);

    createAttendance({
      lesson: lesson._id,
      teacher: lesson.teacher._id,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      weekday: lesson.weekday,
      students: createVisitDetails(studentsList, formData),
    });
  };

  return (
    <FormWrapper submitHandler={submitHandler}>
      <ListStudents students={studentsList} />

      <ShowPostponedLesson lesson={lesson} />
    </FormWrapper>
  );
}
