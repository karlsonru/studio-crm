import { useState } from 'react';
import { format, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import { getTodayTimestamp } from '../../shared/helpers/getTodayTimestamp';
import { useFindSubscriptionsQuery, useGetVisitedLessonsStatisticByStudentQuery } from '../../shared/api';
import { BasicTableWithTitleAndButton, CreateRow, CreateRowWithCollapse } from '../../shared/components/BasicTable';
import { useMobile } from '../../shared/hooks/useMobile';
import { Loading } from '../../shared/components/Loading';
import { ShowError } from '../../shared/components/ShowError';
import { IStudentModel } from '../../shared/models/IStudentModel';
import { CardContentItem } from '../../shared/components/CardContentItem';

interface IVisitsStatistic {
  statistic?: Record<string, number>;
  studentFullname: string;
  startPeriod: number;
}

function VisitsStatistic({ statistic, studentFullname, startPeriod }: IVisitsStatistic) {
  const isMobile = useMobile();

  const statisticFieldsName = {
    visited: 'Посещено',
    missed: 'Пропущено',
    sick: 'Болел',
    unpaid: 'Не оплачено',
  };

  const period = startPeriod === 0 ? 'за всё время' : `с ${format(startPeriod, 'dd-MM-Y')}`;

  return (
    <Card sx={{
      width: isMobile ? '100%' : '20%',
      maxWidth: '325px',
    }}
    >
      <CardHeader
        title={studentFullname}
        subheader={`Статистика ${period}`}
        sx={{
          padding: '0.5rem',
        }}
      />

      <CardContent
        sx={{
          padding: '0.5rem',
          paddingBottom: '0.5rem!important',
        }}
      >
        <List dense>
          {Object.entries(statisticFieldsName)
            .map((parameters) => (
              <CardContentItem
                key={parameters[0]}
                title={parameters[1]}
                value={statistic?.[parameters[0]] ?? 'Неизвестно'}
                props={{
                  width: '100%',
                }}
              />
            ))
          }
        </List>
      </CardContent>

    </Card>
  );
}

interface ICreateRows {
  key: string;
  contentDesktop: Array<string | number>;
  contentMobile: Array<string | number>;
  contentCollapsed: Array<React.ReactNode>;
}

function CreateRows({
  key, contentDesktop, contentMobile, contentCollapsed,
}: ICreateRows) {
  const isMobile = useMobile();

  if (isMobile) {
    return (
      <CreateRowWithCollapse
        key={key}
        content={contentMobile}
        contentCollapsed={contentCollapsed}
      />
    );
  }

  return (
    <CreateRow
      key={key}
      content={contentDesktop}
    />
  );
}

export function ContentTabVisits({ student }: { student: IStudentModel }) {
  const isMobile = useMobile();
  const today = getTodayTimestamp();
  const [showMoreVisits, setShowMoreVisits] = useState(false);
  const [showMoreSubscriptions, setShowMoreSubscriptions] = useState(false);

  const startPeriodLessons = showMoreVisits ? 0 : subMonths(today, 3).getTime();

  // отправляем запрос к статистике на список посещённых занятий по студенту
  const {
    data: responseVisitedLessonsStatisticByStudent,
    isLoading: isLoadingVisitedLessons,
    isError: isErrorVisitedLessons,
    error: errorVisitedLessons,
  } = useGetVisitedLessonsStatisticByStudentQuery({
    query: {
      $and: [
        { students: { $elemMatch: { student: student._id } } },
        { date: { $gte: startPeriodLessons } },
      ],
    },
    id: student._id,
  });

  // найдём все абонементы студента за последние 3 мес
  const {
    data: responseSubscriptions,
    isLoading: isLoadingSubscriptions,
    isError: isErrorSubscriptions,
    error: errorSubscriptions,
  } = useFindSubscriptionsQuery({
    $and: [
      { student: student._id },
      { dateTo: { $gte: showMoreSubscriptions ? 0 : subMonths(today, 3).getTime() } },
    ],
  });

  if (isLoadingVisitedLessons || isLoadingSubscriptions) {
    return <Loading />;
  }

  if (isErrorVisitedLessons || isErrorSubscriptions) {
    return <ShowError details={errorVisitedLessons ?? errorSubscriptions} />;
  }

  // нужно показать что не получилось запросить данные?
  if (!responseVisitedLessonsStatisticByStudent || !responseSubscriptions) {
    return <ShowError details={'Не удалось запросить данные'} />;
  }

  let studentFullname = '';

  const headersVisits = isMobile ? ['Занятие', 'Дата занятия'] : ['Занятие', 'Дата занятия', 'Статус посещения', 'Статус оплаты'];
  const rowsVisits = [...responseVisitedLessonsStatisticByStudent
    .visitedLessons]
    .sort((a, b) => (b.date - a.date))
    .map((visitedLesson) => {
      // с backend'а всегда возвращается массив с 1 студентом по которому делали запрос
      const studentVisit = visitedLesson.students[0];

      if (!studentFullname) {
        studentFullname = studentVisit.student.fullname;
      }

      return (
        <CreateRows
          key={visitedLesson._id}
          contentDesktop={[
            visitedLesson.lesson.title,
            format(visitedLesson.date, 'EEEE, dd-MM-YYY', { locale: ru }),
            studentVisit.visitStatus,
            studentVisit.billingStatus,
          ]}
          contentMobile={[
            visitedLesson.lesson.title,
            format(visitedLesson.date, 'EEEE, dd-MM-YYY', { locale: ru }),
          ]}
          contentCollapsed={[
            <CardContentItem title={'Посещение'} value={studentVisit.visitStatus} props={{ width: '100%' }} />,
            <CardContentItem title={'Оплата'} value={studentVisit.billingStatus} props={{ width: '100%' }} />,
          ]}
        />
      );
    });

  const headersSubscriptions = isMobile ? ['Осталось', 'Действует до'] : ['Занятий всего', 'Осталось', 'Действует до', 'Стоимость'];
  const rowsSubscriptions = responseSubscriptions
    .map((subscription) => <CreateRows
      key={subscription._id}
      contentDesktop={[
        subscription.visitsTotal,
        subscription.visitsLeft,
        format(subscription.dateTo, 'dd-MM-YYY'),
        subscription.price,
      ]}
      contentMobile={[
        subscription.visitsLeft,
        format(subscription.dateTo, 'dd-MM-YYY'),
      ]}
      contentCollapsed={[
        <CardContentItem title={'Всего визитов'} value={subscription.visitsTotal} props={{ width: '100%' }} />,
        <CardContentItem title={'Стоимость'} value={subscription.price} props={{ width: '100%' }} />,
      ]}
    />);

  return (
    <>
      <VisitsStatistic
        studentFullname={studentFullname}
        startPeriod={startPeriodLessons}
        statistic={responseVisitedLessonsStatisticByStudent.statistic}
      />

      <BasicTableWithTitleAndButton
        tableTitle='Посещения'
        headers={headersVisits}
        rows={rowsVisits}
        buttomTitle={showMoreVisits ? 'Скрыть' : 'Показать ещё'}
        buttomAction={() => setShowMoreVisits((prev) => !prev)}
      />

      <BasicTableWithTitleAndButton
        tableTitle='Абонементы'
        headers={headersSubscriptions}
        rows={rowsSubscriptions}
        buttomTitle={showMoreSubscriptions ? 'Скрыть' : 'Показать ещё'}
        buttomAction={() => setShowMoreSubscriptions((prev) => !prev)}
      />
    </>
  );
}
