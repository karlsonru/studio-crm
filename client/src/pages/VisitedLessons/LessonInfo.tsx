import { LessonDetails } from './LessonDetails';
import { StudentsList } from './StudentsList';
import { useFindVisitsQuery } from '../../shared/api';
import { Loading } from '../../shared/components/Loading';
import { ILessonModel } from '../../shared/models/ILessonModel';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { ShowError } from '../../shared/components/ShowError';
import { VisitStatus } from '../../shared/models/IVisitModel';

export function LessonInfo({ selectedLesson }: { selectedLesson: ILessonModel }) {
  const currentDateTimestamp = useAppSelector(
    (state) => state.visitsPageReducer.currentDateTimestamp,
  );

  const {
    data: visitedLesson, isLoading, isError, error,
  } = useFindVisitsQuery({
    lesson: selectedLesson._id,
    date: currentDateTimestamp,
  }, {
    skip: currentDateTimestamp > Date.now(),
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    <ShowError details={error} />;
  }

  if (!visitedLesson) {
    return null;
  }

  return (
  <>
    <LessonDetails
      lesson={selectedLesson}
      dateTimestamp={currentDateTimestamp}
      visitedStudents={
        visitedLesson[0]?.students
          .filter((visit) => visit.visitStatus === VisitStatus.VISITED).length
      }
    />
    <StudentsList
      lesson={selectedLesson}
      dateTimestamp={currentDateTimestamp}
      visitedLessonId={visitedLesson[0]?._id}
    />
  </>
  );
}
