import Grid from '@mui/material/Grid';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useTitle } from '../../shared/hooks/useTitle';
import { BasicTable, CreateRow } from '../../shared/components/BasicTable';
import { useFindStudentsClosestBirthdaysQuery } from '../../shared/api';
import { Loading } from '../../shared/components/Loading';
import { ShowError } from '../../shared/components/ShowError';

function ExpiringSubscriptionsDisplay() {
  return <h2>Истекающие Абонементы</h2>;
}

function UnpaidVisistDisplay() {
  return <h2>Неоплаченные посещения</h2>;
}

function PostponedLessonsDisplay() {
  return <h2>Отработки</h2>;
}

function BirthdayDisplay() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useFindStudentsClosestBirthdaysQuery({
    period: 7,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  const students = data ?? [];
  const rows = students.map((student) => CreateRow(
    { content: [student.fullname, format(student.birthday, 'EEE, d MMM', { locale: ru })] },
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
      <h1>Hello main</h1>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <UnpaidVisistDisplay />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ExpiringSubscriptionsDisplay />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <h2>Отработки</h2>
          <PostponedLessonsDisplay />
        </Grid>
        <Grid item xs={12} sm={6}>
          <h2>Дни рождения</h2>
          <BirthdayDisplay />
        </Grid>
      </Grid>
    </>
  );
}
