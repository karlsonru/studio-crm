import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { timetablePageActions } from '../../shared/reducers/timetablePageSlice';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { ILessonModel } from '../../shared/models/ILessonModel';
import { MODAL_FORM_WIDTH } from '../../shared/constants';
import { AddStudentsDialog } from '../Lesson/AddStudentDialog';

function LessonInfo({ lesson }: { lesson: ILessonModel }) {
  const time = `с ${lesson.timeStart.hh}:${lesson.timeStart.min} по ${lesson.timeEnd.hh}:${lesson.timeEnd.min}`;
  return (
    <>
      <Typography variant="h5" textAlign="center">
        Информация о занятии
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary={`Название: ${lesson.title}`} />
        </ListItem>
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

function StudentsList({ lesson }: { lesson: ILessonModel }) {
  return (
    <List>
      { lesson.students.map((visiting) => (
          <ListItem key={visiting.student._id}>
            <ListItemText primary={visiting.student.fullname} />
          </ListItem>
      ))}
    </List>
  );
}

export const LessonDetails = React.memo((
  { lesson, date }: { lesson: ILessonModel, date: number },
) => {
  const [isAddStudent, setAddStudent] = useState(false);
  const navigate = useNavigate();
  const actions = useActionCreators(timetablePageActions);
  const isShowDetails = useAppSelector((state) => state.timetablePageReducer.isShowDetails);
  const selectedLesson = useAppSelector((state) => state.timetablePageReducer.selectedLesson);

  const closeHandler = () => {
    actions.setShowDetails(false);
    actions.setSelectedLesson(null);
  };

  const goAttendancePage = () => {
    navigate(`/visits?lessonId=${lesson._id}&date=${date}`);
  };

  return (
    <Drawer
      anchor="right"
      open={isShowDetails && selectedLesson === lesson._id}
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
        sx={{ width: MODAL_FORM_WIDTH }}
      >
        <LessonInfo lesson={lesson} />

        <Button
          color="primary"
          onClick={goAttendancePage}
          fullWidth
          sx={{
            textAlign: 'center',
          }}
          >
          Перейти к занятию
        </Button>

        <StudentsList lesson={lesson} />

        <Button
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
          lesson={lesson}
          setModalOpen={setAddStudent}
          date={date}
        />

      </Box>
    </Drawer>
  );
});
