import { useEffect, useState } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography/Typography';
import Button from '@mui/material/Button/Button';
import { BasicTable } from '../../shared/components/BasicTable';
import { useMobile } from '../../shared/hooks/useMobile';
import { useFindSubscriptionsMutation } from '../../shared/api';
import { ISubscriptionModel } from '../../shared/models/ISubscriptionModel';
import { dateValueFormatter } from '../../shared/helpers/dateValueFormatter';

interface IContentSubscriptions {
  lessonId: string;
}

function CreateRowMobile(subscription: ISubscriptionModel) {
  return (
    <TableRow key={subscription._id}>
      <TableCell>
        {subscription.student.fullname}
      </TableCell>
      <TableCell>
        {subscription.visitsLeft}
      </TableCell>
    </TableRow>
  );
}

function CreateRow(subscription: ISubscriptionModel) {
  return (
    <TableRow key={subscription._id} hover>
      <TableCell>
        {subscription.student.fullname}
      </TableCell>
      <TableCell>
        {subscription.visits}
      </TableCell>
      <TableCell>
        {subscription.visitsLeft}
      </TableCell>
      <TableCell>
        {dateValueFormatter(subscription.dateTo)}
      </TableCell>
      <TableCell>
        {subscription.price}
      </TableCell>
    </TableRow>
  );
}

interface IShowSubscriptions {
  lessonId: string;
  isActive: boolean;
}

function ShowSubscriptions({ lessonId, isActive }: IShowSubscriptions) {
  const isMobile = useMobile();
  const [findSubscriptions, { data, isLoading, isError }] = useFindSubscriptionsMutation();

  const query = isActive ? { isActive } : { dateTo: { $lte: Date.now() } };

  useEffect(() => {
    findSubscriptions({
      lesson: lessonId,
      ...query,
    });
  }, []);

  if (isError) {
    return <h3>Ошибка при запросе!</h3>;
  }

  if (isLoading) {
    return <h3>Загружаем ...</h3>;
  }

  if (!data?.payload.length) {
    return <h3>Не найдено</h3>;
  }

  const headers = isMobile ? ['Ученик', 'Остаток'] : ['Ученик', 'Длительность', 'Остаток', 'Действует до', 'Стоимость'];
  const rows = data?.payload.map(isMobile ? CreateRowMobile : CreateRow);
  const title = isActive ? 'Активные абонементы' : 'Прошлые абонементы';

  return (
    <>
      <Typography variant="h5" component={'h5'}>{title}</Typography>
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

      <Button
        variant="outlined"
        onClick={showAllHandler}
        sx={{ m: '1rem 0' }}
      >
        {showAll ? 'Скрыть' : 'Показать'} прошлые абонементы
      </Button>
      {showAll && <ShowSubscriptions lessonId={lessonId} isActive={false} />}
    </>
  );
}
