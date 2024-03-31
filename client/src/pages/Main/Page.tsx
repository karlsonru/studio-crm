import Grid from '@mui/material/Grid';
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
import { PaymentStatus, VisitStatus } from '../../shared/models/IAttendanceModel';
import { getYearMonthDay } from '../../shared/helpers/getYearMonthDay';

function ExpiringSubscriptionsDisplay() {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useFindWithParamsSubscriptionsQuery({
    route: 'expiring',
    params: { days: 7 },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  const subscriptions = data ?? [];
  const rows = subscriptions.map((subscription) => {
    const expiringSubscriptions: Array<React.ReactNode> = [];

    subscription.lessons.forEach((lesson) => {
      expiringSubscriptions.push(
        CreateRow({
          content: [lesson.title, subscription.student.fullname, format(subscription.dateTo, 'dd.MM.yyyy'), subscription.visitsLeft],
          props: {
            onDoubleClick: () => navigate(`/lessons/${lesson._id}`),
          },
        }),
      );
    });
    return expiringSubscriptions;
  }).flat();

  return <BasicTable
    headers={['Занятие', 'Ученик', 'Действует до', 'Осталось занятий']}
    rows={rows}
  />;
}

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

function PostponedAttendancesDisplay() {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useFindWithParamsAttendancesQuery({
    route: 'postponed',
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
      if (student.visitStatus !== VisitStatus.POSTPONED_FUTURE) return;

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
    headers={['Пропущенное занятие', 'Дата', 'Ученик']}
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

export function MainPage() {
  useTitle('Главная');

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <h2>Неоплаченные посещения</h2>
          <UnpaidAttendancesDisplay />
        </Grid>
        <Grid item xs={12} sm={6}>
          <h2>Истекающие абонементы</h2>
          <ExpiringSubscriptionsDisplay />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <h2>Неназначенные отработки</h2>
          <PostponedAttendancesDisplay />
        </Grid>
        <Grid item xs={12} sm={6}>
          <h2>Дни рождения</h2>
          <BirthdayDisplay />
        </Grid>
      </Grid>
    </>
  );
}
