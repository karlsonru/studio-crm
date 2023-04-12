import { useSearchParams } from 'react-router-dom';
import { LessonDetails } from './LessonDetails';
import { StudentsList } from './StudentsList';
import { useFindVisitsQuery, useGetLessonQuery } from '../../shared/api';

export function LessonInfo() {
  const [searchParams] = useSearchParams();
  const selectedLessonId = searchParams.get('lessonId') ?? '';
  const currentDateTimestamp = +(searchParams.get('date') ?? 0);

  const isFuture = currentDateTimestamp > Date.now();

  const {
    data: currentLesson, isFetching: isFetchingCurrent,
  } = useGetLessonQuery(selectedLessonId, {
    skip: !selectedLessonId,
  });

  const {
    data: visitedLesson, isFetching: isFetchingVisited,
  } = useFindVisitsQuery({
    $and: [
      { lesson: selectedLessonId },
      { date: currentDateTimestamp },
    ],
  }, {
    skip: isFuture || !selectedLessonId,
  });

  // ничего не рисуем, пока информация запрашивается
  if (isFetchingCurrent || isFetchingVisited || !currentLesson?.payload || !selectedLessonId) {
    return null;
  }

  const isVisited = (visitedLesson && visitedLesson.payload?.length > 0) ?? false;
  const visitedLessonId = visitedLesson?.payload[0]?._id;

  const visitedStudents = visitedLesson?.payload[0]?.students.filter((visit) => visit.visitStatus === 'visited').length || 0;

  return (
  <>
    <LessonDetails
      lesson={currentLesson.payload}
      dateTimestamp={currentDateTimestamp}
      visitedStudents={visitedStudents}
    />
    <StudentsList
      lesson={currentLesson.payload}
      dateTimestamp={currentDateTimestamp}
      isVisited={isVisited}
      visitedLessonId={visitedLessonId}
    />
  </>
  );
}
