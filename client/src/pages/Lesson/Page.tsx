import { useParams } from 'react-router-dom';
import { useGetLessonQuery } from '../../shared/api';
import { ContentTabDetails } from './ContentTabDetails';
import { ContentSubscriptions } from './ContentTabSubscriptions';
import { ContentStudents } from './ContentTabStudents';
import { CreateSubscriptionModal } from '../../shared/components/modals/CreateSubscriptionModal';
import { SearchParamsButton } from '../../shared/components/buttons/SearchParamsButton';
import { useTitle } from '../../shared/hooks/useTitle';
import { Loading } from '../../shared/components/Loading';
import { ShowError } from '../../shared/components/ShowError';
import { TabsWrapper } from '../../shared/components/TabsWrapper';

export function LessonPage() {
  const { lessonId } = useParams();

  const {
    data: lesson, isError, isLoading, error,
  } = useGetLessonQuery(lessonId ?? '', {
    skip: !lessonId,
  });

  useTitle(lesson?.title);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  if (!lesson) {
    return null;
  }

  return (
    <>
    <TabsWrapper
      defaultTab="students"
      tabsContent={[
        {
          label: 'Участники',
          value: 'students',
          content: [<ContentStudents key="students" lesson={lesson} />],
        },
        {
          label: 'Детали',
          value: 'details',
          content: [<ContentTabDetails key="details" lesson={lesson} />],
        },
        {
          label: 'Абонементы',
          value: 'subscriptions',
          content: [<ContentSubscriptions key="subscriptions" lesson={lesson} />],
          conditionally: [<SearchParamsButton title="Оформить" param="create-subscription" />],
        },
      ]}
    />
    <CreateSubscriptionModal />
    </>
  );
}
