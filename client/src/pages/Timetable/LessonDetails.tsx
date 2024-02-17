import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { AddStudentsDialog } from '../Lesson/AddStudentDialog';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { useMobile } from '../../shared/hooks/useMobile';
import { timetablePageActions } from '../../shared/reducers/timetablePageSlice';
import { ILessonModel, IVisitingStudent, VisitType } from '../../shared/models/ILessonModel';
import { MODAL_FORM_WIDTH } from '../../shared/constants';
import { useFindWithParamsAttendancesQuery } from '../../shared/api';
import { Loading } from '../../shared/components/Loading';
import { ShowError } from '../../shared/components/ShowError';
import { IVisit, VisitStatus } from '../../shared/models/IAttendanceModel';
import { PrimaryButton } from '../../shared/components/buttons/PrimaryButton';
import { getVisitStatusName } from '../../shared/helpers/getVisitStatusName';

function sortStudentsByVisitType(
  a: IVisitingStudent | IVisit,
  b: IVisitingStudent | IVisit,
) {
  if (a.visitType === VisitType.REGULAR && b.visitType === VisitType.REGULAR) {
    return a.student.fullname.localeCompare(b.student.fullname);
  }

  if (b.visitType === VisitType.REGULAR) {
    return 1;
  }

  return -1;
}

function LessonInfo({ lesson, date }: { lesson: ILessonModel, date: number }) {
  const time = `с ${lesson.timeStart.hh}:${lesson.timeStart.min} по ${lesson.timeEnd.hh}:${lesson.timeEnd.min}`;
  return (
    <>
      <Typography variant="h6" textAlign="center">
        Информация о занятии <br/>
        {lesson.title}
      </Typography>
      <Typography variant="subtitle1" textAlign="center">
        {format(date, 'dd.MM.yyyy')}
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary={`Педагог: ${lesson.teacher.fullname}`} />
        </ListItem>
        <ListItem>
          <ListItemText primary={`Время: ${time}`} />
        </ListItem>
      </List>
    </>
  );
}

function getVisitTypeName(visitType: VisitType) {
  const visitTypeNames = {
    [VisitType.REGULAR]: 'постоянный',
    [VisitType.SINGLE]: 'однократный',
    [VisitType.NEW]: 'новый',
    [VisitType.POSTPONED]: 'отработка',
  };

  return visitTypeNames[visitType];
}

function StudentsList({ students }: { students: Array<IVisitingStudent | IVisit> }) {
  const sortedStudents = students.sort(sortStudentsByVisitType);

  return (
    <List>
      { sortedStudents.map((visiting) => <ListItem key={visiting.student._id}>
            <ListItemText
              primary={visiting.student.fullname}
              secondary={getVisitTypeName(visiting.visitType)}
            />
            {// @ts-ignore
              visiting.visitStatus && <ListItemText secondary={getVisitStatusName(visiting.visitStatus)} />
            }
          </ListItem>)
        }
    </List>
  );
}

export const LessonDetails = React.memo(() => {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const actions = useActionCreators(timetablePageActions);
  const [isAddStudent, setAddStudent] = useState(false);
  const { selectedLesson: lesson, date } = useAppSelector(
    (state) => state.timetablePageReducer.lessonDetails,
  );

  const {
    data: attendance,
    isLoading,
    isError,
    error,
  } = useFindWithParamsAttendancesQuery({
    params: {
      lessonId: lesson?._id,
      day: format(date || 0, 'd'),
      month: format(date || 0, 'M'),
      year: format(date || 0, 'yyyy'),
    },
  }, {
    skip: !date || Date.now() < date,
  });

  if (!lesson || !date) return null;

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  const closeHandler = () => {
    actions.setLessonDetails({
      date: null,
      selectedLesson: null,
    });
  };

  const goAttendancePage = () => {
    closeHandler();
    navigate(`/attendances?lessonId=${lesson._id}&date=${date}`);
  };

  const students = attendance && attendance.length
    ? attendance[0]?.students
    : lesson.students.filter(
      (student) => student.visitType === VisitType.REGULAR || student.date === date,
    );

  return (
    <Drawer
      anchor="right"
      open={true}
      onClose={closeHandler}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'transparent',
          },
        },
      }}
    >
      <Box
        component="div"
        padding={2}
        sx={{ width: isMobile ? '100%' : MODAL_FORM_WIDTH }}
      >
        <LessonInfo lesson={lesson} date={date} />

        <Button
          size="large"
          color="primary"
          onClick={goAttendancePage}
          fullWidth
        >
          Перейти к занятию
        </Button>

        <StudentsList students={students} />

        <Button
          size="large"
          color="success"
          onClick={() => setAddStudent(true)}
          fullWidth
        >
          Записть на занятие
        </Button>

        <AddStudentsDialog
          isOpen={isAddStudent}
          setModalOpen={() => setAddStudent(false)}
          lesson={lesson}
          date={date}
        />

      </Box>
    </Drawer>
  );
});
