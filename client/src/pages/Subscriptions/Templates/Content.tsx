import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetSubscriptionTemplatesQuery, useDeleteSubscriptionTemplateMutation } from '../../../shared/api';
import { ConfirmationDialog, DeleteDialogText } from '../../../shared/components/ConfirmationDialog';
import { ISubscriptionTemplateModel } from '../../../shared/models/ISubscriptionModel';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { CardContentItem } from '../../../shared/components/CardContentItem';
import { Loading } from '../../../shared/components/Loading';
import { ShowError } from '../../../shared/components/ShowError';
import { CardWrapper } from '../../../shared/components/CardWrapper';

function AddCard({ cardDetails }: { cardDetails: ISubscriptionTemplateModel }) {
  const [, setSearchParams] = useSearchParams();

  const [deleteCard] = useDeleteSubscriptionTemplateMutation();
  const [isModalOpen, setModalOpen] = useState(false);

  const deleteButtonWithIcon = <IconButton onClick={() => setModalOpen(true)}>
    <DeleteIcon />
  </IconButton>;

  return (
    <>
      <CardWrapper>
        <CardHeader
          title={cardDetails.title}
          action={deleteButtonWithIcon}
        />

        <CardActionArea onClick={() => setSearchParams({ 'update-template': 'true', id: cardDetails._id })} >
          <CardContent>
            <CardContentItem title="Занятий" value={cardDetails.visits} />
            <Divider />
            <CardContentItem title="Стоимость P" value={cardDetails.price} />
          </CardContent>
        </CardActionArea>
      </CardWrapper>

      <ConfirmationDialog
        title='Удалить шаблон'
        contentEl={<DeleteDialogText name={cardDetails.title} />}
        isOpen={isModalOpen}
        setModalOpen={setModalOpen}
        callback={() => deleteCard(cardDetails._id)}
      />
    </>
  );
}

export function SubscriptionsTemplatesContent() {
  const titleFilter = useAppSelector(
    (state) => state.subscriptionsPageReducer.templates.filters.title,
  );

  const {
    data, isLoading, isError, error,
  } = useGetSubscriptionTemplatesQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  if (!data) {
    return null;
  }

  const filteredData = data.filter((template: ISubscriptionTemplateModel) => {
    if (titleFilter && !template.title.includes(titleFilter)) return false;
    return true;
  });

  return (
    <Grid container maxWidth='100%' margin={0}>
      { filteredData.map((template) => <AddCard key={template._id} cardDetails={template} />) }
    </Grid>
  );
}
