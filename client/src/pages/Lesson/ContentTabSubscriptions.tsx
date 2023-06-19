import { useState } from 'react';
import { format } from 'date-fns';
import Typography from '@mui/material/Typography/Typography';
import { BasicTable, CreateRow } from '../../shared/components/BasicTable';
import { useMobile } from '../../shared/hooks/useMobile';
import { useFindSubscriptionsQuery } from '../../shared/api';
import { getTodayTimestamp } from '../../shared/helpers/getTodayTimestamp';
import { PrimaryButton } from '../../shared/components/buttons/PrimaryButton';
import { Loading } from '../../shared/components/Loading';
import { ShowError } from '../../shared/components/ShowError';
import { ILessonModel } from '../../shared/models/ILessonModel';

interface IContentSubscriptions {
  lesson: ILessonModel;
}

interface IShowSubscriptions {
  lessonId: string;
  isActive: boolean;
}

function ShowSubscriptions({ lessonId, isActive }: IShowSubscriptions) {
  const isMobile = useMobile();
  const today = getTodayTimestamp();
  const query = { dateTo: isActive ? { $gte: today } : { $lte: today } };

  const {
    data, isLoading, isError, error,
  } = useFindSubscriptionsQuery({
    lesson: lessonId,
    ...query,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  if (!data?.length) {
    return <h3>Не найдено</h3>;
  }

  const headers = isMobile ? ['Ученик', 'Остаток'] : ['Ученик', 'Длительность', 'Остаток', 'Действует до', 'Стоимость'];
  const rows = data?.map((subscription) => (
    <CreateRow
      key={subscription._id}
      content={
        isMobile
          ? [
            subscription.student.fullname,
            subscription.visitsLeft,
          ]
          : [
            subscription.student.fullname,
            subscription.visitsTotal,
            subscription.visitsLeft,
            format(subscription.dateTo, 'Y-MM-dd'),
            subscription.price,
          ]
      }
    />
  ));

  return (
    <>
      <Typography
        variant="h5"
        component={'h5'}
      >
        {isActive ? 'Активные абонементы' : 'Прошлые абонементы'}
      </Typography>

      <BasicTable headers={headers} rows={rows} />
    </>
  );
}

export function ContentSubscriptions({ lesson }: IContentSubscriptions) {
  const [showAll, setShowAll] = useState(false);

  const showAllHandler = () => {
    setShowAll((isShowAll) => !isShowAll);
  };

  return (
    <>
      <ShowSubscriptions lessonId={lesson._id} isActive={true} />

      <PrimaryButton
        content={showAll ? 'Скрыть прошлые абонементы' : 'Показать прошлые абонементы'}
        props={{
          onClick: showAllHandler,
          sx: { marginY: '1rem' },
        }}
      />
      {showAll && <ShowSubscriptions lessonId={lesson._id} isActive={false} />}
    </>
  );
}
