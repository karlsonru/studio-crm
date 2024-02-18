import { format } from 'date-fns';
import { LessonDetails } from './LessonDetails';
import { StudentsListFuture, StudentsListVisited } from './StudentsList';
import { useFindWithParamsAttendancesQuery } from '../../shared/api';
import { Loading } from '../../shared/components/Loading';
import { ILessonModel, IVisitingStudent, VisitType } from '../../shared/models/ILessonModel';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { ShowError } from '../../shared/components/ShowError';
import { AttendanceType, IVisit, VisitStatus } from '../../shared/models/IAttendanceModel';

export function LessonInfo({ selectedLesson }: { selectedLesson: ILessonModel }) {
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

  // определим список студентов к отображению
  let studentsList: Array<IVisitingStudent | IVisit> = isAttendanceDone
    ? attendance[0].students
    : selectedLesson.students.filter(
      (student) => student.visitType === VisitType.REGULAR || student.date === searchDateTimestamp,
    );

  console.log(`hasAttendance: ${hasAttendance}`);
  console.log(`isAttendanceDone: ${isAttendanceDone}`);
  console.log('studentsList before concat:');
  console.log(studentsList);

  // если это будущее посещение, то добавим студентов из будущего посещения в общий список
  if (hasAttendance && attendance[0].type === AttendanceType.FUTURE) {
    console.log('Добавляем студента');
    console.log(attendance[0].students);
    studentsList = [...studentsList, ...attendance[0].students];
  }

  const visitedStudents = hasAttendance
    ? attendance[0].students.filter((visit) => visit.visitStatus === VisitStatus.VISITED).length
    : 0;

  console.log('studentsList after concat');
  console.log(studentsList);

  return (
  <>
    <LessonDetails
      lesson={selectedLesson}
      dateTimestamp={searchDateTimestamp}
      visitedStudents={visitedStudents}
    />

    {!isAttendanceDone && <StudentsListFuture
      lesson={selectedLesson}
      dateTimestamp={searchDateTimestamp}
      studentsList={studentsList}
    />}

    {isAttendanceDone && <StudentsListVisited
      attendance={attendance[0]}
    />}
  </>
  );
}
