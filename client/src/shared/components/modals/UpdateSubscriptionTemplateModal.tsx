import { FormEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/system/Stack';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { usePatchSubscriptionTemplateMutation, useGetSubscriptionTemplatesQuery } from '../../api';
import { NumberField } from '../fields/NumberField';
import { SubmitButton } from '../buttons/SubmitButton';
import { FormContentColumn } from '../FormContentColumn';

function validateForm(formData: { [key: string]: FormDataEntryValue }) {
  if (!formData.title || (formData.title as string).trim().length < 3) {
    return 'fullname';
  }

  if (!formData.price || (+formData.price as number) < 0) {
    return 'price';
  }

  return '';
}

function calculateDuration(period: string, duration: number) {
  const day = 86_400_000; // длительность дня в милисекундах
  switch (period) {
    case 'month':
      return duration * day * 30;
    case 'week':
      return duration * day * 7;
    case 'day':
      return duration * day;
    default:
      return 0;
  }
}

export function UpdateSubscriptionTemplateModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: templateEdit } = useGetSubscriptionTemplatesQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data: data?.payload.find((template) => template._id === searchParams.get('id')),
    }),
  });

  const [updateSubscriptionTemplate] = usePatchSubscriptionTemplateMutation();
  const [formValidation, setFormValidation] = useState({
    title: true,
    price: true,
    visits: true,
    duration: true,
  });

  if (!searchParams.has('update-template')) return <></>;

  if (!templateEdit) {
    return <h1>Is Loading...</h1>;
  }

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(form).entries());

    validateForm(formData);

    setFormValidation({
      title: true,
      price: true,
      visits: true,
      duration: true,
    });

    const errorName = validateForm(formData);
    if (errorName) {
      setFormValidation(() => ({
        ...formValidation,
        [errorName]: false,
      }));
      return;
    }

    const payload = {
      title: formData.title as string,
      price: +formData.price as number,
      visits: +formData.visits as number,
      duration: calculateDuration(formData.period as string, +formData.duration),
      isActive: true,
    };

    updateSubscriptionTemplate({ id: templateEdit._id, newItem: payload });

    form.reset();
  };

  return (
    <Dialog open={searchParams.has('update-template')} onClose={() => setSearchParams('')}>
      <DialogTitle>Редактировать шаблон</DialogTitle>
      <DialogContent>
        <form onSubmit={submitHandler}>
          <FormContentColumn>
            <TextField
              variant="outlined"
              name="title"
              label="Название"
              defaultValue={templateEdit.title}
              fullWidth
              required
              error={!formValidation.title}
              helperText={!formValidation.title && 'Название не должно быть пустым или слишком коротким'}
            />
            <NumberField
              name="price"
              label="Цена"
              error={!formValidation.price}
              minValue={0}
              defaultValue={templateEdit.price}
            />
            <NumberField
              name="visits"
              label="Количество занятий"
              error={!formValidation.visits}
              minValue={1}
              defaultValue={templateEdit.visits}
            />

            <FormControl>
              <FormLabel sx={{ mb: 1 }}>Период</FormLabel>

              <Stack direction="row">
                <NumberField
                  name="duration"
                  label="Длительность"
                  error={!formValidation.duration}
                  minValue={1}
                  defaultValue={Math.floor(templateEdit.duration / 86_400_000)}
                />

                <Select
                  name="period"
                  defaultValue="day"
                  sx={{ flexGrow: 1, minWidth: '115px' }}
                >
                  <MenuItem value="day">Дней</MenuItem>
                  <MenuItem value="week">Недель</MenuItem>
                  <MenuItem value="month">Месяцев</MenuItem>
                </Select>
              </Stack>

            </FormControl>

          </FormContentColumn>

          <DialogActions sx={{ paddingRight: '0' }}>
            <Button autoFocus variant='contained' color='error' onClick={() => setSearchParams('')}>
              Закрыть
            </Button>
            <SubmitButton content='Подтвердить' />
          </DialogActions>

        </form>
      </DialogContent>
    </Dialog>
  );
}