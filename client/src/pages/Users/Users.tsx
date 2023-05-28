import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMobile } from '../../shared/hooks/useMobile';
import { useTitle } from '../../shared/hooks/useTitle';
import { useDeleteUserMutation, useGetUsersQuery } from '../../shared/api';
import { IUserModel } from '../../shared/models/IUserModel';
import { ConfirmationDialog, DeleteDialogText } from '../../shared/components/ConfirmationDialog';
import { Loading } from '../../shared/components/Loading';
import { ShowError } from '../../shared/components/ShowError';
import { SearchParamsButton } from '../../shared/components/buttons/SearchParamsButton';
import { CreateSubscriptionTemplateModal } from '../../shared/components/modals/CreateSubscriptionTemplateModal';
import { UpdateSubscriptionTemplateModal } from '../../shared/components/modals/UpdateSubscriptionTemplateModal';

function CardContentItem({ title, value }: { title: string, value: string | number }) {
  return (
    <Stack direction="row" justifyContent="space-between" my={1} >
      <Typography>
        { title }
      </Typography>
      <Typography sx={{ fontWeight: 'bold' }}>
        { value }
      </Typography>
  </Stack>
  );
}

function AddCard({ cardDetails }: { cardDetails: IUserModel }) {
  const [, setSearchParams] = useSearchParams();
  const isMobile = useMobile();

  const [deleteCard] = useDeleteUserMutation();
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Card variant="outlined" sx={{ width: '325px', marginRight: isMobile ? 0 : '0.5rem', marginBottom: '0.5rem' }}>
        <CardHeader title={cardDetails.fullname} action={
          <IconButton onClick={() => setModalOpen(true)}>
            <DeleteIcon />
          </IconButton>
          } />
        <CardActionArea onClick={() => setSearchParams({ 'update-user': 'true', id: cardDetails._id })}>
          <CardContent>
            <CardContentItem title="Телефон" value={'XXX'} />
            <Divider />
            <CardContentItem title="Роль" value={cardDetails.role} />
            <Divider />
            <CardContentItem title="Ставка" value={500} />
            <Divider />
            <CardContentItem title="День рождения" value={format(cardDetails.birthday, 'dd-MM-yyyy')} />
          </CardContent>
        </CardActionArea>
      </Card>

      <ConfirmationDialog
        title='Удалить сотрудника'
        contentEl={<DeleteDialogText name={cardDetails.fullname} />}
        isOpen={isModalOpen}
        setModalOpen={setModalOpen}
        callback={() => deleteCard(cardDetails._id)}
      />
    </>
  );
}

export function UsersPage() {
  useTitle('Сотрудники');

  const {
    data: responseUsers,
    isLoading,
    isError,
    error,
  } = useGetUsersQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  if (!responseUsers) {
    return null;
  }

  const employeeCards = responseUsers.payload.map(
    (user) => <AddCard key={user._id} cardDetails={user} />,
  );

  return (
    <>
      <header style={{ marginBottom: '1rem' }}>
        <CreateSubscriptionTemplateModal />
        <UpdateSubscriptionTemplateModal />
        <SearchParamsButton title='Добавить' param='create-user'/>
      </header>

      <Grid container maxWidth='100%' margin={0}>
        { employeeCards }
      </Grid>
    </>
  );
}
