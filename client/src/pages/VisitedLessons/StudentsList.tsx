import { FormEvent } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { VisitStatusButton } from './VisitStatusButton';
import { SuccessButton } from '../../shared/components/SuccessButton';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { IStudentModel } from '../../shared/models/IStudentModel';
import { ILessonModel } from '../../shared/models/ILessonModel';
import {
  useGetLessonQuery,
  useCreateVisitMutation,
  useFindVisitsQuery,
  usePatchVisitMutation,
} from '../../shared/api';

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
    selectFromResult: (result) => ({ data: result.data?.payload[0] }),
  });

  if (!data) return null;

  return (
    <List>
      {data.students.map(
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
    selectFromResult: (result) => ({ data: result.data?.payload }),
  });

  if (!data) return null;

  return (
    <List>
      {data.students.map(
        (student) => <StudentsListItem key={student._id} student={student} />,
      )}
    </List>
  );
}

interface IStudentsList {
  lesson: ILessonModel,
  isVisited: boolean;
  visitedLessonId?: string;
  dateTimestamp: number;
}

export function StudentsList({
  lesson, isVisited, visitedLessonId, dateTimestamp,
}: IStudentsList) {
  const [updateVisit] = usePatchVisitMutation();
  const [createVisit] = useCreateVisitMutation();

  const visits = useAppSelector((state) => state.visitsPageReducer.visits);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isVisited && visitedLessonId) {
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
    <form onSubmit={submitHandler} style={{ width: '100%', maxWidth: '600px' }}>
      { isVisited && <StudentsListVisited lessonId={lesson._id} /> }
      { !isVisited && <StudentsListFuture lessonId={lesson._id} /> }

      <SuccessButton content={isVisited ? 'Обновить' : 'Отметить'} props={{ sx: { float: 'right', marginRight: '1rem' } }} />
    </form>
  );
}
