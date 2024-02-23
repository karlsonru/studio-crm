import { format } from 'date-fns';
import { StudentsListFuture, StudentsListVisited } from './StudentsList';
import { useFindWithParamsAttendancesQuery } from '../../shared/api';
import { Loading } from '../../shared/components/Loading';
import { ILessonModel } from '../../shared/models/ILessonModel';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { ShowError } from '../../shared/components/ShowError';
import { AttendanceType } from '../../shared/models/IAttendanceModel';
import { TeacherCard } from './TeacherCard';

export function StudentsInfo({ selectedLesson }: { selectedLesson: ILessonModel }) {
  const searchDateTimestamp = useAppSelector(
    (state) => state.attendancePageReducer.searchDateTimestamp,
  );

  // ищем есть ли информация по уже проведенному занятию
  const {
    data: attendance,
    isLoading,
    isError,
    error,
  } = useFindWithParamsAttendancesQuery({
    params: {
      lessonId: selectedLesson._id,
      day: format(searchDateTimestamp, 'd'),
      month: format(searchDateTimestamp, 'M'),
      year: format(searchDateTimestamp, 'yyyy'),
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    <ShowError details={error} />;
  }

  // если есть ответ на запрос и массив с посещениями не пустой - посещение было
  const hasAttendance = attendance !== undefined && attendance.length > 0;

  // проверим является ли посещение уже состоявшимся или только запланированное
  const isAttendanceDone = hasAttendance && attendance[0].type === AttendanceType.DONE;

  return (
  <>
    {!isAttendanceDone && <StudentsListFuture
      lesson={selectedLesson}
      studentsFromFuture={(hasAttendance && attendance[0].students) || undefined}
    />}

    {isAttendanceDone && <StudentsListVisited
      attendance={attendance[0]}
    />}

    {isAttendanceDone && <TeacherCard teacher={attendance[0].teacher} attendance={attendance[0]} />}
  </>
  );
}
