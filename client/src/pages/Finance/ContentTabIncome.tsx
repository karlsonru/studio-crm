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
import { getTodayTimestamp } from '../../shared/helpers/getTodayTimestamp';
import { useMobile } from '../../shared/hooks/useMobile';

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

  const period = 3;

  const interval = eachMonthOfInterval({
    start: subMonths(today, period),
    end: today,
  });

  const labels = interval.slice(-period).map((date) => format(date, 'LLLL', { locale: ru }));

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
              data: [20, 50, 80, 200, 150, 150],
              backgroundColor: '#1E90FF',
              stack: 'income',
            },
            {
              label: 'Доходы',
              data: [100, 200, 300, 150, 200, 250],
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              stack: 'outcome',
            },
            {
              label: 'Абонементы',
              data: [50, 50, 60, 40, 30, 20],
              backgroundColor: '#FFA500',
              stack: 'subscriptions',
            },
          ],
        }}
      />
    </Box>
  );
}
