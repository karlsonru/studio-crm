import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useFindWithParamsAttendancesQuery, useGetSubscriptionsQuery } from '../../../shared/api';
import { useMobile } from '../../../shared/hooks/useMobile';
import { Loading } from '../../../shared/components/Loading';
import { ShowError } from '../../../shared/components/ShowError';
import { BasicTable, CreateRow } from '../../../shared/components/BasicTable';
import { getYearMonthDay } from '../../../shared/helpers/getYearMonthDay';
import { ISubscriptionModel } from '../../../shared/models/ISubscriptionModel';

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
  const isMobile = useMobile();

  return (
    <>
    <Grid
      container
      spacing={1}
      columns={{ xs: 8, md: 12 }}
    >
      <Grid item xs={8} sm={12}>
        <Typography variant='h6'>
          {subscription.student.fullname}
        </Typography>
      </Grid>

    {
        Object.keys(subscription).map((key) => {
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
            <>
              <Grid item xs={4} sm={6}>
                <Typography>{subscriptionFieldsTranslation[key]}</Typography>
              </Grid>
              <Grid item xs={4} sm={6} textAlign={isMobile ? 'end' : 'start'}>
                <Typography>{value as string}</Typography>
              </Grid>
            </>
          );
        })
      }
      </Grid>
    </>
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
