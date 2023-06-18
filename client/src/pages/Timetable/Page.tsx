import { useEffect } from 'react';
import { set } from 'date-fns';
import { PageHeader } from './PageHeader';
import { TimetableContent } from './Content';
import { useFindLessonsQuery } from '../../shared/api';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useMobile } from '../../shared/hooks/useMobile';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { timetablePageActions } from '../../shared/reducers/timetablePageSlice';
import { Loading } from '../../shared/components/Loading';
import { useTitle } from '../../shared/hooks/useTitle';

export function TimetablePage() {
  useTitle('Расписание');

  const view = useAppSelector((state) => state.timetablePageReducer.view);
  const currentDate = useAppSelector((state) => state.timetablePageReducer.currentDate);
  const currentMonth = new Date(currentDate).getMonth();
  const isMobile = useMobile();
  const actions = useActionCreators(timetablePageActions);

  // запрашиваем занятия на +1 месяц от текущих и -1 месяц от текущих
  const { data, isLoading } = useFindLessonsQuery({
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

  if (!data) return null;

  return (
    <>
      <PageHeader />
      <TimetableContent lessons={data} />
    </>
  );
}
