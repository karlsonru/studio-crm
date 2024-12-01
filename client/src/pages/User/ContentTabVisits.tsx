import { useNavigate } from 'react-router-dom';
import { format, subMonths } from 'date-fns';
import { getTodayTimestamp } from '../../shared/helpers/getTodayTimestamp';
import { useFindAttendancesQuery } from '../../shared/api';
import { BasicTable, CreateRow } from '../../shared/components/BasicTable';
import { Loading } from '../../shared/components/Loading';
import { ShowError } from '../../shared/components/ShowError';
import { VisitStatus } from '../../shared/models/IAttendanceModel';
import { useMobile } from '../../shared/hooks/useMobile';
import { getYearMonthDay } from '../../shared/helpers/getYearMonthDay';

export function ContentTabVisits({ userId }: { userId: string }) {
  const isMobile = useMobile();
  const today = getTodayTimestamp();
  const dateFrom = subMonths(today, 2).getTime();
  const navigate = useNavigate();

  // отправляем запрос к статистике на список посещённых занятий по студенту
  const {
    data: visitedLessonsResponse, isLoading, isError, error,
  } = useFindAttendancesQuery({
    $and: [
      { date: { $gte: dateFrom } },
      { date: { $lte: today } },
      { teacher: userId },
    ],
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  if (!visitedLessonsResponse) {
    return null;
  }

  const headersVisits = isMobile ? ['Дата', 'Название'] : ['Дата', 'Название', 'Учеников', 'Посетило'];
  const rowsVisits = visitedLessonsResponse
    .map((visit) => <CreateRow
      key={visit._id}
      content={
        isMobile
          ? [
            format(visit.date, 'yyyy-MM-dd'),
            visit.lesson.title,
          ]
          : [
            format(visit.date, 'yyyy-MM-dd'),
            visit.lesson.title,
            visit.lesson.students.length,
            visit.students.filter((visited) => visited.visitStatus === VisitStatus.VISITED).length,
          ]
        }
      props={{
        onDoubleClick: () => {
          const { year, month, day } = getYearMonthDay(visit.date);
          navigate(`/attendances/history?lessonId=${visit.lesson._id}&year=${year}&month=${month + 1}&day=${day}`);
        },
      }}
    />);

  return (
    <BasicTable
      headers={headersVisits}
      rows={rowsVisits}
    />
  );
}
