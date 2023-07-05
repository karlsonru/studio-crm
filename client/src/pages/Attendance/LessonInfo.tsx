import { LessonDetails } from './LessonDetails';
import { StudentsList } from './StudentsList';
import { useFindAttendancesQuery } from '../../shared/api';
import { Loading } from '../../shared/components/Loading';
import { ILessonModel } from '../../shared/models/ILessonModel';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { ShowError } from '../../shared/components/ShowError';
import { VisitStatus } from '../../shared/models/IAttendanceModel';

export function LessonInfo({ selectedLesson }: { selectedLesson: ILessonModel }) {
  const currentDateTimestamp = useAppSelector(
    (state) => state.visitsPageReducer.currentDateTimestamp,
  );

  const {
    data: attendance, isLoading, isError, error,
  } = useFindAttendancesQuery({
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

  /*
  if (!attendance) {
    return null;
  }
  */

  const visitedStudents = attendance && attendance.length
    ? attendance[0]?.students.filter((visit) => visit.visitStatus === VisitStatus.VISITED).length
    : 0;

  return (
  <>
    <LessonDetails
      lesson={selectedLesson}
      dateTimestamp={currentDateTimestamp}
      visitedStudents={visitedStudents}
    />
    <StudentsList
      lesson={selectedLesson}
      dateTimestamp={currentDateTimestamp}
      visitedLessonId={attendance && attendance.length ? attendance[0]._id : undefined}
    />
  </>
  );
}
