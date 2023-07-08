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
import { ILessonModel, VisitType } from '../../shared/models/ILessonModel';
import { MODAL_FORM_WIDTH } from '../../shared/constants';

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
    [VisitType.MISSED_REGULAR]: 'отработка',
  };

  return visitTypeNames[visitType];
}

function StudentsList({ lesson, date }: { lesson: ILessonModel, date: number }) {
  const sortedStudents = [...lesson.students].sort((a, b) => {
    if (a.visitType === VisitType.REGULAR && b.visitType === VisitType.REGULAR) {
      return a.student.fullname.localeCompare(b.student.fullname);
    }

    if (b.visitType === VisitType.REGULAR) {
      return 1;
    }

    return -1;
  });

  return (
    <List>
      { sortedStudents.map((visiting) => {
        // в списке показываем только тех временных студентов, у которых совпадает дата визита
        if (visiting.visitType !== VisitType.REGULAR
            && visiting.date !== date) {
          return null;
        }

        return (
            <ListItem key={visiting.student._id}>
              <ListItemText
                primary={visiting.student.fullname}
                secondary={getVisitTypeName(visiting.visitType)}
              />
            </ListItem>
        );
      })}
    </List>
  );
}

export const LessonDetails = React.memo(() => {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const [isAddStudent, setAddStudent] = useState(false);
  const actions = useActionCreators(timetablePageActions);
  const { selectedLesson: lesson, date } = useAppSelector(
    (state) => state.timetablePageReducer.lessonDetails,
  );

  if (!lesson || !date) return null;

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
          sx={{
            textAlign: 'center',
          }}
          >
          Перейти к занятию
        </Button>

        <StudentsList lesson={lesson} date={date} />

        <Button
          size="large"
          color="success"
          onClick={() => setAddStudent(true)}
          fullWidth
          sx={{
            textAlign: 'center',
          }}
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
