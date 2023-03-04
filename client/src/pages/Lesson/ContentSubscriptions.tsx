import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { ISubscriptionModel } from '../../shared/models/ISubscriptionModel';
import { useGetSubscriptionsQuery } from '../../shared/api';
import { BasicTable } from '../../shared/components/BasicTable';

interface IContentSubscriptions {
  lessonId: string;
}

function CreateRow(subscription: ISubscriptionModel) {
  return (
    <TableRow key={subscription._id}>
      <TableCell>
        {subscription.student.fullname}
      </TableCell>
      <TableCell>
        {subscription.visits}
      </TableCell>
      <TableCell>
        Осталось занятий
      </TableCell>
      <TableCell>
        {subscription.dateTo}
      </TableCell>
      <TableCell>
        {subscription.price}
      </TableCell>
    </TableRow>
  );
}

export function ContentSubscriptions({ lessonId }: IContentSubscriptions) {
  const { data: subscriptions } = useGetSubscriptionsQuery();

  if (!subscriptions || !subscriptions.payload) {
    return <h2>Loading...</h2>;
  }

  const headers = ['Ученик', 'Длительность', 'Остаток', 'Срок действия', 'Стоимость'];
  const rows = subscriptions.payload
    .filter((subscription) => subscription.lesson === lessonId)
    .map(CreateRow);

  return <BasicTable headers={headers} rows={rows} />;
}
