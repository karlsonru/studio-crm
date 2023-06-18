import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetSubscriptionTemplatesQuery, useDeleteSubscriptionTemplateMutation } from '../../../shared/api';
import { ConfirmationDialog, DeleteDialogText } from '../../../shared/components/ConfirmationDialog';
import { useMobile } from '../../../shared/hooks/useMobile';
import { ISubscriptionTemplateModel } from '../../../shared/models/ISubscriptionModel';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';

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

function AddCard({ cardDetails }: { cardDetails: ISubscriptionTemplateModel }) {
  const [, setSearchParams] = useSearchParams();
  const days = cardDetails.duration / 86400000;
  const isMobile = useMobile();

  const [deleteCard] = useDeleteSubscriptionTemplateMutation();
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Card variant="outlined" sx={{ width: '325px', marginRight: isMobile ? 0 : '0.5rem', marginBottom: '0.5rem' }}>
        <CardHeader title={cardDetails.title} action={
          <IconButton onClick={() => setModalOpen(true)}>
            <DeleteIcon />
          </IconButton>
          } />
        <CardActionArea onClick={() => setSearchParams({ 'update-template': 'true', id: cardDetails._id })}>
          <CardContent>
            <CardContentItem title="Занятий" value={cardDetails.visits} />
            <Divider />
            <CardContentItem title="Длительность (дней)" value={days} />
            <Divider />
            <CardContentItem title="Стоимость P" value={cardDetails.price} />
          </CardContent>
        </CardActionArea>
      </Card>

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
  const { data } = useGetSubscriptionTemplatesQuery();

  const titleFilter = useAppSelector(
    (state) => state.subscriptionsPageReducer.templates.filters.title,
  );

  if (!data) return null;

  const filteredData = data.payload.filter((template: ISubscriptionTemplateModel) => {
    if (titleFilter && !template.title.includes(titleFilter)) return false;
    return true;
  });

  return (
    <Grid container maxWidth='100%' margin={0}>
      { filteredData.map((template) => <AddCard key={template._id} cardDetails={template} />) }
    </Grid>
  );
}
