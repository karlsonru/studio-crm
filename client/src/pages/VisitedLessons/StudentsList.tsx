import { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import { IStudentModel } from 'shared/models/IStudentModel';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { visitsPageActions } from '../../shared/reducers/visitsPageSlice';
import {
  useGetLessonQuery, useCreateVisitMutation, useFindVisitsQuery, usePatchVisitMutation,
} from '../../shared/api';
import { VisitStatusButton } from './VisitStatusButton';

interface IStudentsList {
  lessonId: string;
  date: number;
}

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

function StudentsList({ lessonId, date }: IStudentsList) {
  const isFuture = date > Date.now();

  const actions = useActionCreators(visitsPageActions);

  // если это future, то это не может быть visited lesson - делаем skip
  const { data: visitedLesson, isFetching: isFetchingVisited } = useFindVisitsQuery({
    $and: [
      { lesson: lessonId },
      { date },
    ],
  }, {
    skip: isFuture,
  });

  // в любом случае получим futureLesson. Возможно это должен быть visited, но он не был отмечен
  const { data: futureLesson } = useGetLessonQuery(lessonId, {
    selectFromResult: (result) => ({ data: result.data?.payload }),
  });

  // не рендерим компонент если не завершился хотя бы один из запросов
  if (isFetchingVisited) return null;

  // если у нас есть прошедшее занятие - возвращаем информацию по нему
  if (visitedLesson?.payload.length) {
    // скажем что этот урок был посещён
    actions.setIsCurrentLessonVisited(true);
    actions.setCurrentLessonId(visitedLesson.payload[0]._id);

    return (
      <List>
        {visitedLesson.payload[0].students.map(
          (visit) => <StudentsListItem
            key={visit.student._id}
            student={visit.student}
            defaultStatus={visit.visitStatus}
          />,
        )}
      </List>
    );
  }

  if (!futureLesson) return null;

  // в остальных случаях вернём информацию по будущему занятию
  actions.setIsCurrentLessonVisited(false);
  actions.setCurrentLessonId(futureLesson._id);

  return (
    <List>
      {futureLesson.students.map(
        (student) => <StudentsListItem key={student._id} student={student} />,
      )}
    </List>
  );
}

export function StudentsVisitsList() {
  const date = useAppSelector(
    (state) => state.visitsPageReducer.currentDateTimestamp,
  );
  const visits = useAppSelector(
    (state) => state.visitsPageReducer.visits,
  );
  const isCurrentLessonVisited = useAppSelector(
    (state) => state.visitsPageReducer.isCurrentLessonVisited,
  );
  const currentLessonId = useAppSelector(
    (state) => state.visitsPageReducer.currentLessonId,
  );

  const [updateVisit] = usePatchVisitMutation();
  const [createVisit] = useCreateVisitMutation();

  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('lessonId') ?? '';

  // возьмём информацию по текущему занятию из кэша RTK Query
  const { data: currentLesson } = useGetLessonQuery(lessonId, {
    selectFromResult: (result) => ({ data: result.data?.payload }),
    // skip: true,
  });

  if (!lessonId || !currentLesson) return null;

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isCurrentLessonVisited) {
      updateVisit({
        id: currentLessonId,
        newItem: {
          students: visits,
          /*
          // @ts-ignore
          // $addToSet: {
          students: visits,
          // },
          */
        },
      });
    } else {
      createVisit({
        lesson: lessonId,
        teacher: currentLesson.teacher._id,
        day: currentLesson.day,
        date,
        students: visits,
      });
    }
  };

  return (
    <form onSubmit={submitHandler} style={{ width: '100%', maxWidth: '600px' }}>
      <StudentsList lessonId={lessonId} date={date} />
      <Button
        type='submit'
        variant='contained'
        color='success'
        sx={{
          float: 'right',
          marginRight: '1rem',
        }}
      >
        {isCurrentLessonVisited ? 'Обновить' : 'Отметить'}
      </Button>
    </form>
  );
}
