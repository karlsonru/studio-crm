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
  const currentDate = useAppSelector((state) => state.timetablePageReducer.currentDate);
  const actions = useActionCreators(timetablePageActions);
  const currentMonth = new Date(currentDate).getMonth();

  // запрашиваем занятия с датой окончания начиная с -1 месяц от текущей
  const {
    data,
    isLoading,
    isError,
    error,
  } = useFindLessonsQuery({
    dateTo: {
      $gte: set(currentDate, { month: currentMonth - 1, date: 1 }).getTime(),
    },
  });

  if (isMobile) {
    actions.setView('day');
  }

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
