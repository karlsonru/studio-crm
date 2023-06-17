import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { eachMonthOfInterval, format, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';
import Box from '@mui/material/Box';
import { useMobile } from '../../shared/hooks/useMobile';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useGetIncomeStatisticQuery } from '../../shared/api';
import { getTodayTimestamp } from '../../shared/helpers/getTodayTimestamp';
import { Loading } from '../../shared/components/Loading';
import { ShowError } from '../../shared/components/ShowError';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export function ContentTabIncome() {
  const isMobile = useMobile();
  const today = getTodayTimestamp();
  const { dateFrom, location, period } = useAppSelector((state) => state.financeReducer.income);

  const {
    data: statisticResponse, isLoading, isError, error,
  } = useGetIncomeStatisticQuery({
    query: { dateFrom },
    id: location,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  if (!statisticResponse?.payload) {
    return null;
  }

  const interval = eachMonthOfInterval({
    start: subMonths(today, period),
    end: today,
  });

  const monthes = interval.slice(-period);
  const labels = monthes.map((date) => format(date, 'LLLL', { locale: ru }));

  // костыль с <div>&nbsp;</div> для нормального resize Bar https://github.com/chartjs/Chart.js/issues/11005
  return (
    <Box component='div'>
      <div>&nbsp;</div>
      <Bar
        style={{
          maxHeight: isMobile ? 'auto' : '30vh',
        }}
        data={{
          labels,
          datasets: [
            {
              label: 'Расходы',
              data: monthes.map((date) => statisticResponse.payload.expenses[date.getMonth()]),
              backgroundColor: '#1E90FF',
              stack: 'income',
              minBarLength: 5,
            },
            {
              label: 'Доходы',
              data: monthes.map((date) => statisticResponse.payload.income[date.getMonth()]),
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              stack: 'outcome',
              minBarLength: 5,
            },
            {
              label: 'Абонементы',
              data: monthes.map((date) => statisticResponse.payload.amount[date.getMonth()]),
              backgroundColor: '#FFA500',
              stack: 'subscriptions',
              minBarLength: 10,
            },
          ],
        }}
      />
    </Box>
  );
}
