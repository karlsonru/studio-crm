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
import Box from '@mui/material/Box';
import { FinanceFilters } from './FinanceFilters';
import { useMobile } from '../../shared/hooks/useMobile';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useGetFinanceStatisticQuery } from '../../shared/api';
import { Loading } from '../../shared/components/Loading';
import { ShowError } from '../../shared/components/ShowError';
import { getMonthName } from '../../shared/helpers/getMonthName';

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
  const { location, month, userId } = useAppSelector((state) => state.financeReducer.income);

  const {
    data: statisticResponse,
    isLoading,
    isError,
    error,
  } = useGetFinanceStatisticQuery({
    locationId: location,
    month,
    userId,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  if (!statisticResponse) {
    return null;
  }

  // <div>&nbsp;</div> is a hack to resize Bar https://github.com/chartjs/Chart.js/issues/11005
  return (
    <>
      <FinanceFilters tabName="income" />

      <Box component='div'>
        <div>&nbsp;</div>
        <Bar
          options={{
            indexAxis: 'y',
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: `${getMonthName(month)} (${statisticResponse.subscriptionsAmount} aбонементов)`,
              },
              legend: {
                align: 'start',
              },
            },
          }}
          style={{
            maxHeight: isMobile ? 'auto' : '20vh',
          }}
          data={{
            labels: [''],
            datasets: [
              {
                label: 'Доходы',
                data: [statisticResponse.income],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                stack: 'income',
                minBarLength: 10,
              },
              {
                label: 'Расходы',
                data: [statisticResponse.expenses],
                backgroundColor: '#1E90FF',
                stack: 'expenses',
                minBarLength: 10,
              },
            ],
          }}
        />
      </Box>
    </>
  );
}
