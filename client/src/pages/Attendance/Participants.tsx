import { format } from 'date-fns';
import { StudentsListLesson, StudentsListAttendance } from './StudentsList';
import { useFindWithParamsAttendancesQuery } from '../../shared/api';
import { Loading } from '../../shared/components/Loading';
import { ILessonModel } from '../../shared/models/ILessonModel';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { ShowError } from '../../shared/components/ShowError';
import { AttendanceType } from '../../shared/models/IAttendanceModel';
import { TeacherCard } from './TeacherCard';

export function Participants({ selectedLesson }: { selectedLesson: ILessonModel }) {
  const searchDateTimestamp = useAppSelector(
    (state) => state.attendancePageReducer.searchDateTimestamp,
  );

  // ищем есть ли уже проведеённое занятие по этому уроку
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

  // если в ответе массив не пустой - занятие есть
  const hasAttendance = attendance !== undefined && attendance.length > 0;

  // проверим является ли посещение уже состоявшимся или только запланированное
  const isAttendanceDone = hasAttendance && attendance[0].type === AttendanceType.DONE;

  const studentsList = isAttendanceDone
    ? <StudentsListAttendance attendance={attendance[0]} />
    : <StudentsListLesson
      lesson={selectedLesson}
      studentsFromFutureAttendance={(hasAttendance && attendance[0].students) || undefined}
    />;

  const teacherCard = isAttendanceDone
    ? <TeacherCard teacher={attendance[0].teacher} attendance={attendance[0]} />
    : null;

  return (
    <>
      {studentsList}

      {teacherCard}
    </>
  );
}
