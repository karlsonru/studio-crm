import { useNavigate, useParams } from 'react-router-dom';
import { useFindWithParamsAttendancesQuery, useGetSubscriptionsQuery } from '../../../shared/api';
import { Loading } from '../../../shared/components/Loading';
import { ShowError } from '../../../shared/components/ShowError';
import { BasicTable, CreateRow } from '../../../shared/components/BasicTable';
import { getYearMonthDay } from '../../../shared/helpers/getYearMonthDay';

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

  if (!attendances) {
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
    <BasicTable
      headers={['Дата', 'Занятие']}
      rows={rows}
    />
  );
}
