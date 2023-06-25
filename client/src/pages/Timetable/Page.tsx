import { useEffect } from 'react';
import { set } from 'date-fns';
import { PageHeader } from './PageHeader';
import { TimetableContent } from './Content';
import { LessonDetails } from './LessonDetails';
import { useFindLessonsQuery } from '../../shared/api';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useMobile } from '../../shared/hooks/useMobile';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { timetablePageActions } from '../../shared/reducers/timetablePageSlice';
import { useTitle } from '../../shared/hooks/useTitle';
import { Loading } from '../../shared/components/Loading';
import { ShowError } from '../../shared/components/ShowError';

export function TimetablePage() {
  useTitle('Расписание');
  const isMobile = useMobile();

  const view = useAppSelector((state) => state.timetablePageReducer.view);
  const currentDate = useAppSelector((state) => state.timetablePageReducer.currentDate);
  const actions = useActionCreators(timetablePageActions);

  const currentMonth = new Date(currentDate).getMonth();

  // запрашиваем занятия на +1 месяц от текущих и -1 месяц от текущих
  const {
    data, isLoading, isError, error,
  } = useFindLessonsQuery({
    dateFrom: { $lte: set(currentDate, { month: currentMonth - 1, date: 1 }).getTime() },
    dateTo: { $gte: set(currentDate, { month: currentMonth + 1, date: 1 }).getTime() },
  });

  useEffect(() => {
    if (isMobile) {
      actions.setView('day');
    } else if (view === undefined) {
      actions.setView('week');
    }
  }, [view, isMobile]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  if (!data) return null;

  return (
    <>
      <PageHeader />
      <TimetableContent lessons={data} />
      <LessonDetails />
    </>
  );
}
