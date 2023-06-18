import { useState } from 'react';
import { format } from 'date-fns';
import Typography from '@mui/material/Typography/Typography';
import { BasicTable, CreateRow } from '../../shared/components/BasicTable';
import { useMobile } from '../../shared/hooks/useMobile';
import { useFindSubscriptionsQuery } from '../../shared/api';
import { getTodayTimestamp } from '../../shared/helpers/getTodayTimestamp';
import { PrimaryButton } from '../../shared/components/buttons/PrimaryButton';

interface IContentSubscriptions {
  lessonId: string;
}

interface IShowSubscriptions extends IContentSubscriptions {
  isActive: boolean;
}

function ShowSubscriptions({ lessonId, isActive }: IShowSubscriptions) {
  const isMobile = useMobile();
  const today = getTodayTimestamp();
  const query = { dateTo: isActive ? { $gte: today } : { $lte: today } };

  const { data, isError, isLoading } = useFindSubscriptionsQuery({
    lesson: lessonId,
    ...query,
  });

  if (isLoading) {
    return <h3>Идёт загрузка...</h3>;
  }

  if (isError) {
    return <h3>Ошибка при запросе!</h3>;
  }

  if (!data?.payload.length) {
    return <h3>Не найдено</h3>;
  }

  const headers = isMobile ? ['Ученик', 'Остаток'] : ['Ученик', 'Длительность', 'Остаток', 'Действует до', 'Стоимость'];
  const rows = data?.payload.map((subscription) => (
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

export function ContentSubscriptions({ lessonId }: IContentSubscriptions) {
  const [showAll, setShowAll] = useState(false);

  const showAllHandler = () => {
    setShowAll((isShowAll) => !isShowAll);
  };

  return (
    <>
      <ShowSubscriptions lessonId={lessonId} isActive={true} />

      <PrimaryButton
        content={showAll ? 'Скрыть прошлые абонементы' : 'Показать прошлые абонементы'}
        props={{
          onClick: showAllHandler,
          sx: { marginY: '1rem' },
        }}
      />
      {showAll && <ShowSubscriptions lessonId={lessonId} isActive={false} />}
    </>
  );
}
