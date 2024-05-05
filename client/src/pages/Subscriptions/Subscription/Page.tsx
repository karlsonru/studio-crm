import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import Typography from '@mui/material/Typography';
import { useFindWithParamsAttendancesQuery, useGetSubscriptionsQuery } from '../../../shared/api';
import { Loading } from '../../../shared/components/Loading';
import { ShowError } from '../../../shared/components/ShowError';
import { BasicTable, CreateRow } from '../../../shared/components/BasicTable';
import { getYearMonthDay } from '../../../shared/helpers/getYearMonthDay';
import { ISubscriptionModel } from '../../../shared/models/ISubscriptionModel';
import { MODAL_FORM_WIDTH } from '../../../shared/constants';

const subscriptionFieldsTranslation: Record<string, string> = {
  dateFrom: 'Начало абонемента',
  dateTo: 'Конец абонемента',
  price: 'Стоимость абонемента',
  lessons: 'Занятия',
  visitsTotal: 'Всего посещений',
  visitsPostponed: 'Отложенные посещения',
  visitsLeft: 'Осталось посещений',
};

function SubscriptionInfoCard({ subscription }: { subscription: ISubscriptionModel }) {
  return (
    <BasicTable
      headers={['', '']}
      props={{
        sx: { maxWidth: MODAL_FORM_WIDTH },
      }}
      rows={Object.keys(subscription).map((key) => {
        if (!(key in subscriptionFieldsTranslation)) {
          return null;
        }

        let value;
        if (key === 'lessons') {
          value = subscription[key].map((lesson) => lesson.title).join(', ');
        } else if (key === 'dateFrom' || key === 'dateTo') {
          value = format(subscription[key], 'dd.MM.yyyy');
        } else {
          value = subscription[key as keyof ISubscriptionModel];
        }

        return (
          <CreateRow
            key={key}
            content={[
              <Typography>{subscriptionFieldsTranslation[key]}</Typography>,
              <Typography textAlign={'right'}>{value as string}</Typography>,
            ]}
          />
        );
      })}
    />
  );
}

export function SubscriptionPage() {
  const navigate = useNavigate();
  const { subscriptionId } = useParams();

  const { subscription } = useGetSubscriptionsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      subscription: data?.find((s) => s._id === subscriptionId),
    }),
  });

  const {
    data: attendances,
    isLoading,
    isError,
    error,
  } = useFindWithParamsAttendancesQuery({
    params: {
      subscriptionId,
      dateFrom: subscription?.dateFrom,
      dateTo: subscription?.dateTo,
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  if (!attendances || !subscription) {
    return null;
  }

  const rows = attendances.map((attendance) => {
    const { year, month, day } = getYearMonthDay(attendance.date);

    return CreateRow({
      content: [attendance.date, attendance.lesson.title],
      props: {
        onDoubleClick: () => navigate(`/attendances?lessonId=${attendance.lesson._id}&year=${year}&month=${month + 1}&day=${day}`),
      },
    });
  });

  return (
    <>
      <SubscriptionInfoCard subscription={subscription} />
      <hr />
      <BasicTable
        headers={['Дата', 'Занятие']}
        rows={rows}
      />
    </>
  );
}
