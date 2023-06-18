import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMobile } from '../../shared/hooks/useMobile';
import { useDeleteUserMutation, useGetUsersQuery } from '../../shared/api';
import { IUserModel, userRoleLocal } from '../../shared/models/IUserModel';
import { ConfirmationDialog, DeleteDialogText } from '../../shared/components/ConfirmationDialog';
import { Loading } from '../../shared/components/Loading';
import { ShowError } from '../../shared/components/ShowError';
import { CardContentItem } from '../../shared/components/CardContentItem';

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
            <CardContentItem title="Телефон" value={cardDetails.phone} />
            <Divider />
            <CardContentItem title="Роль" value={userRoleLocal[cardDetails.role]} />
            <Divider />
            <CardContentItem title="Ставка" value={cardDetails.salary ?? ''} />
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

export function UsersContent() {
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

  const employeeCards = responseUsers.map(
    (user) => <AddCard key={user._id} cardDetails={user} />,
  );

  return (
    <Grid container maxWidth='100%' margin={0}>
      { employeeCards }
    </Grid>
  );
}
