import { useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { ContentTabDetails } from './ContentTabDetails';
import { ContentTabVisits } from './ContentTabVisits';
import { useGetStudentQuery } from '../../shared/api';
import { SearchParamsButton } from '../../shared/components/buttons/SearchParamsButton';
import { CreateSubscriptionModal } from '../../shared/components/modals/CreateSubscriptionModal';
import { useTitle } from '../../shared/hooks/useTitle';
import { useMobile } from '../../shared/hooks/useMobile';
import { Loading } from '../../shared/components/Loading';
import { ShowError } from '../../shared/components/ShowError';
import { TabsWrapper } from '../../shared/components/TabsWrapper';

function ContactTab() {
  const isMobile = useMobile();

  return (
    <Stack direction="row">
      <WhatsAppIcon color="success" />
      {!isMobile && <Typography variant="subtitle1">Связаться</Typography>}
    </Stack>
  );
}

export function StudentPage() {
  const { studentId } = useParams();

  const {
    data: student, isLoading, isError, error,
  } = useGetStudentQuery(studentId ?? '', {
    skip: !studentId,
  });

  useTitle(student?.fullname);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  if (!studentId || !student) {
    return null;
  }

  const goWhatsApp = () => window.open(
    `https://api.whatsapp.com/send/?phone=${student.contacts[0].phone}&text&type=phone_number`,
    '_blank',
  );

  return (
    <>
      <TabsWrapper
        defaultTab='details'
        tabsContent={[
          {
            label: 'Детали',
            value: 'details',
            content: [
              <ContentTabDetails key="details" student={student} />,
            ],
          },
          {
            label: 'Посещения',
            value: 'visits',
            content: [
              <ContentTabVisits key="visits" student={student} />,
            ],
            conditionally: <SearchParamsButton title="Оформить абонемент" param="create-subscription" />,
          },
          {
            label: <ContactTab key={student.contacts[0].phone} />,
            value: '',
            content: [],
            tabProps: { onClick: goWhatsApp },
          },
        ]}
      />
      <CreateSubscriptionModal />
    </>
  );
}
