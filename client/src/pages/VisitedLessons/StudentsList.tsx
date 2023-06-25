import { FormEvent } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { VisitStatusButton } from './VisitStatusButton';
import { SubmitButton } from '../../shared/components/buttons/SubmitButton';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { IStudentModel } from '../../shared/models/IStudentModel';
import { ILessonModel } from '../../shared/models/ILessonModel';
import {
  useGetLessonQuery,
  useCreateVisitMutation,
  useFindVisitsQuery,
  usePatchVisitMutation,
} from '../../shared/api';
import { MODAL_FORM_WIDTH } from '../../shared/constants';

interface IStudentsListItem {
  student: IStudentModel;
  defaultStatus?: string;
}

function StudentsListItem({ student, defaultStatus }: IStudentsListItem) {
  return (
    <ListItem divider={true}>
      <ListItemText primary={student.fullname} />
      <VisitStatusButton studentId={student._id} defaultStatus={defaultStatus} />
    </ListItem>
  );
}

function StudentsListVisited({ lessonId }: { lessonId: string }) {
  const date = useAppSelector(
    (state) => state.visitsPageReducer.currentDateTimestamp,
  );

  const { data } = useFindVisitsQuery({
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
          defaultStatus={visit.visitStatus}
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
        (visiting) => <StudentsListItem key={visiting.student._id} student={visiting.student} />,
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
  const [updateVisit] = usePatchVisitMutation();
  const [createVisit] = useCreateVisitMutation();

  const visits = useAppSelector((state) => state.visitsPageReducer.visits);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (visitedLessonId) {
      updateVisit({
        id: visitedLessonId,
        newItem: {
          students: visits,
        },
      });
    } else {
      createVisit({
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
