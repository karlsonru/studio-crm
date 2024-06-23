import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useTitle } from '../../shared/hooks/useTitle';
import { BasicTable, CreateRow } from '../../shared/components/BasicTable';
import {
  useFindWithParamsStudentsQuery,
  useFindWithParamsSubscriptionsQuery,
  useFindWithParamsAttendancesQuery,
} from '../../shared/api';
import { Loading } from '../../shared/components/Loading';
import { ShowError } from '../../shared/components/ShowError';
import { PaymentStatus } from '../../shared/models/IAttendanceModel';
import { getYearMonthDay } from '../../shared/helpers/getYearMonthDay';
import mainPageLogo from '../../assets/images/mainPageLogo.png';

function UnpaidAttendancesDisplay() {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useFindWithParamsAttendancesQuery({
    route: 'unpaid',
    params: { days: 30 },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  const attendances = data ?? [];
  const rows = attendances.map((attendance) => {
    const studentsWithPostponedVisits: Array<React.ReactNode> = [];

    attendance.students.forEach((student) => {
      if (student.paymentStatus !== PaymentStatus.UNPAID) return;

      const { year, month, day } = getYearMonthDay(attendance.date);

      const row = CreateRow({
        content: [attendance.lesson.title, format(attendance.date, 'dd.MM.yyyy'), student.student.fullname],
        props: {
          onDoubleClick: () => navigate(`/attendances?lessonId=${attendance.lesson._id}&year=${year}&month=${month + 1}&day=${day}`),
        },
      });
      studentsWithPostponedVisits.push(row);
    });

    return [...studentsWithPostponedVisits];
  }).flat();

  return <BasicTable
    headers={['Неоплаченное занятие', 'Дата', 'Ученик']}
    rows={rows}
  />;
}

function BirthdayDisplay() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useFindWithParamsStudentsQuery({
    route: 'closest-birthdays',
    params: {
      days: 7,
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  const students = data ?? [];
  const rows = students.map((student) => CreateRow(
    { content: [student.fullname, format(student.birthday, 'EEEEEE, d MMM', { locale: ru })] },
  ));

  return <BasicTable
    headers={['Имя', 'День рождения']}
    rows={rows}
    />;
}

function GoToButton({ route, label }: { route: string, label: string }) {
  const navigate = useNavigate();
  return <Button
    variant='outlined'
    size='large'
    onClick={() => navigate(route)}
    sx={{
      marginY: '1rem',
      width: '100%',
      fontSize: '1.2rem',
    }}
  >
    {label}
  </Button>;
}

export function MainPage() {
  useTitle('Главная');

  return (
    <>
      <Paper sx={{
        width: '100%',
        minHeight: '50vh',

        backgroundImage: `url(${mainPageLogo})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right',
        backgroundSize: 'cover',
      }}
      >
      </Paper>

    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <GoToButton route='/attendancespostponed' label='Отработки' />
      </Grid>

      <Grid item xs={12} sm={6}>
        <GoToButton route='/subscriptions' label='Истекающие абонементы' />
      </Grid>
    </Grid>

    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <GoToButton route='/fake' label='Неоплаченные посещения' />
      </Grid>

      <Grid item xs={12} sm={6}>
        <GoToButton route='/fake' label='Дни рождения' />
      </Grid>
    </Grid>
    </>
  );
}
