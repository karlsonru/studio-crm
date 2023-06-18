import { useParams } from 'react-router-dom';
import { useGetStudentQuery } from 'shared/api';
import { ContentTabDetails } from './ContentTabDetails';
import { ContentTabVisits } from './ContentTabVisits';
import { SearchParamsButton } from '../../shared/components/buttons/SearchParamsButton';
import { CreateSubscriptionModal } from '../../shared/components/modals/CreateSubscriptionModal';
import { useTitle } from '../../shared/hooks/useTitle';
import { Loading } from '../../shared/components/Loading';
import { ShowError } from '../../shared/components/ShowError';
import { TabsWrapper } from '../../shared/components/TabsWrapper';

export function StudentPage() {
  const { studentId } = useParams();

  const {
    data: student, isLoading, isError, error,
  } = useGetStudentQuery(studentId ?? '', {
    skip: !studentId,
  });

  useTitle(student?.fullname ?? 'Ученики');

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  if (!studentId || !student) {
    return null;
  }

  return (
    <>
    <TabsWrapper
      defaultTab='details'
      tabsContent={[
        {
          label: 'Детали',
          value: 'details',
          content: [
            <ContentTabDetails student={student} />,
          ],
        },
        {
          label: 'Посещения',
          value: 'visits',
          content: [
            <ContentTabVisits student={student} />,
          ],
          conditionally: <SearchParamsButton title="Оформить абонемент" param="create-subscription" />,
        },
      ]}
    />
    <CreateSubscriptionModal />
    </>
  );
}
