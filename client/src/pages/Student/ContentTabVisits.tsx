import { useState } from 'react';
import { format, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { getTodayTimestamp } from '../../shared/helpers/getTodayTimestamp';
import { useFindSubscriptionsQuery, useFindVisitsQuery } from '../../shared/api';
import { BasicTable, CreateRow } from '../../shared/components/BasicTable';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { IVisitModel, VisitStatus, BillingStatus } from '../../shared/models/IVisitModel';
import { MODAL_FORM_WIDTH } from '../../shared/constants';

interface IVisitsStatistic {
  visitedLessons: Array<IVisitModel>;
  studentId: string;
  startPeriod: number;
}

// TODO переделать статистику на всплываюшее окно при наведении на заголовок с именем? Popover?
function VisitsStatistic({ visitedLessons, studentId, startPeriod }: IVisitsStatistic) {
  const statistic = {
    visited: { name: 'Посещено', value: 0 },
    missed: { name: 'Пропущено', value: 0 },
    sick: { name: 'Болел', value: 0 },
    unpaid: { name: 'Не оплачено', value: 0 },
  };

  let studentName = '';

  visitedLessons.forEach(
    (visited) => {
      const visit = visited.students.find((students) => students.student._id === studentId);

      if (!studentName && visit) {
        studentName = visit?.student.fullname;
      }

      switch (visit?.visitStatus) {
        case VisitStatus.VISITED:
          statistic.visited.value += 1;
          break;
        case VisitStatus.MISSED:
          statistic.missed.value += 1;
          break;
        case VisitStatus.SICK:
          statistic.sick.value += 1;
          break;
        default:
      }

      if (visit?.billingStatus === BillingStatus.UNPAID) {
        statistic.unpaid.value += 1;
      }
    },
  );

  const period = startPeriod === 0 ? 'За всё время' : `С ${format(startPeriod, 'dd-MM-Y')}`;

  return (
    <Card sx={{ maxWidth: MODAL_FORM_WIDTH }} >
      <CardHeader
        title={`Статистика ${studentName}`}
        subheader={period}
        sx={{ padding: '0.5rem' }}
      />
      <CardContent sx={{ padding: '0.5rem', paddingBottom: '-16px' }}>
        <List>
          { Object.values(statistic).map((parameter) => (
            <ListItem>
              <ListItemText primary={`${parameter.name} ${parameter.value}`} />
            </ListItem>
          )) }
        </List>
      </CardContent>
    </Card>
  );
}

export function ContentTabVisits({ studentId }: { studentId: string }) {
  const today = getTodayTimestamp();
  const [showMoreVisits, setShowMoreVisits] = useState(false);
  const [showMoreSubscriptions, setShowMoreSubscriptions] = useState(false);

  const startPeriodLessons = showMoreVisits ? 0 : subMonths(today, 3).getTime();

  // найдём все занятия за последние 3 мес, которые посещал студент
  const visitedLessons = useFindVisitsQuery({
    $and: [
      { students: { $elemMatch: { student: studentId } } },
      { date: { $gte: startPeriodLessons } },
    ],
  });

  // найдём все абонементы студента за последние 3 мес
  const subscriptions = useFindSubscriptionsQuery({
    $and: [
      { student: studentId },
      { dateTo: { $gte: showMoreSubscriptions ? 0 : subMonths(today, 3).getTime() } },
    ],
  });

  if (!subscriptions.data?.payload || !visitedLessons.data?.payload) {
    return <>Не удалось найти занятия!</>;
  }

  const headersVisits = ['Занятие', 'Дата занятия', 'Статус посещения', 'Статус оплаты'];
  const rowsVisits = visitedLessons.data.payload
    .map((visitedLesson) => {
      const studentVisit = visitedLesson.students.find((visit) => visit.student._id === studentId);
      return (
        <CreateRow
          key={visitedLesson._id}
          content={[
            visitedLesson.lesson.title,
            format(visitedLesson.date, 'EEEE, dd-MM-YYY', { locale: ru }),
            studentVisit?.visitStatus,
            studentVisit?.billingStatus,
          ]}
        />
      );
    });

  const headersSubscriptions = ['Занятий всего', 'Осталось', 'Действует до', 'Стоимость'];
  const rowsSubscriptions = subscriptions.data.payload
    .map((subscription) => (
      <CreateRow
        key={subscription._id}
        content={[
          subscription.template.visits,
          subscription.visitsLeft,
          format(subscription.dateTo, 'dd-MM-YYY'),
          subscription.template.price,
        ]}
      />
    ));

  return (
    <>
      <VisitsStatistic
        studentId={studentId}
        startPeriod={startPeriodLessons}
        visitedLessons={visitedLessons.data.payload}
      />

      <Typography variant="h5" component={'h5'}>Посещения</Typography>
      <BasicTable headers={headersVisits} rows={rowsVisits} />
      <PrimaryButton
        content={showMoreVisits ? 'Скрыть' : 'Показать ещё'}
        props={{
          onClick: () => setShowMoreVisits((prev) => !prev),
          sx: {
            marginY: '1rem',
          },
        }}
      />

      <Typography variant="h5" component={'h5'}>Абонементы</Typography>
      <BasicTable headers={headersSubscriptions} rows={rowsSubscriptions} />
      <PrimaryButton
        content={showMoreSubscriptions ? 'Скрыть' : 'Показать ещё'}
        props={{
          onClick: () => setShowMoreSubscriptions((prev) => !prev),
          sx: {
            marginY: '1rem',
          },
        }}
      />
    </>
  );
}
