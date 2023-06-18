import { useSearchParams } from 'react-router-dom';
import { LessonDetails } from './LessonDetails';
import { StudentsList } from './StudentsList';
import { useFindVisitsQuery, useGetLessonQuery } from '../../shared/api';
import { Loading } from '../../shared/components/Loading';

export function LessonInfo() {
  const [searchParams] = useSearchParams();
  const selectedLessonId = searchParams.get('lessonId') ?? '';
  const currentDateTimestamp = +(searchParams.get('date') ?? 0);

  const isFuture = currentDateTimestamp > Date.now();

  const {
    data: currentLesson, isLoading: isLoadingCurrent,
  } = useGetLessonQuery(selectedLessonId, {
    skip: !selectedLessonId,
  });

  const {
    data: visitedLesson, isLoading: isisLoadingVisited,
  } = useFindVisitsQuery({
    $and: [
      { lesson: selectedLessonId },
      { date: currentDateTimestamp },
    ],
  }, {
    skip: isFuture || !selectedLessonId,
  });

  // ничего не рисуем, пока информация запрашивается
  if (isLoadingCurrent || isisLoadingVisited) {
    return <Loading />;
  }

  if (!currentLesson || !selectedLessonId || !visitedLesson) {
    return null;
  }

  const isVisited = (visitedLesson && visitedLesson?.length > 0) ?? false;
  const visitedLessonId = visitedLesson[0]._id;

  const visitedStudents = visitedLesson[0].students.filter((visit) => visit.visitStatus === 'visited').length || 0;

  return (
  <>
    <LessonDetails
      lesson={currentLesson}
      dateTimestamp={currentDateTimestamp}
      visitedStudents={visitedStudents}
    />
    <StudentsList
      lesson={currentLesson}
      dateTimestamp={currentDateTimestamp}
      isVisited={isVisited}
      visitedLessonId={visitedLessonId}
    />
  </>
  );
}
