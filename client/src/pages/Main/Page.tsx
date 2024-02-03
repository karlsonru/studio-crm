import { useTitle } from '../../shared/hooks/useTitle';

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
  return <h2>Дни рождения</h2>;
}

export function MainPage() {
  useTitle('Главная');

  return (
    <>
      <h1>Hello main</h1>

      <ExpiringSubscriptionsDisplay />
      <UnpaidVisistDisplay />
      <PostponedLessonsDisplay />
      <BirthdayDisplay />
    </>
  );
}
