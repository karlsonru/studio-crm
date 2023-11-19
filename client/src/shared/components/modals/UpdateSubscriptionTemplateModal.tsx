import { FormEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
/*
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/system/Stack';
*/
import { usePatchSubscriptionTemplateMutation, useGetSubscriptionTemplatesQuery } from '../../api';
import { NumberField } from '../fields/NumberField';
import { DialogFormWrapper } from '../DialogFormWrapper';
import { Loading } from '../Loading';

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
  const [searchParams] = useSearchParams();
  const { data: templateEdit } = useGetSubscriptionTemplatesQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data: data?.find((template) => template._id === searchParams.get('id')),
    }),
  });

  const [updateSubscriptionTemplate, requestStatus] = usePatchSubscriptionTemplateMutation();
  const [formValidation, setFormValidation] = useState({
    title: true,
    price: true,
    visits: true,
    duration: true,
  });

  if (searchParams.has('update-template') && !templateEdit) {
    return <Loading />;
  }

  if (!templateEdit) {
    return null;
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
    };

    updateSubscriptionTemplate({ id: templateEdit._id, newItem: payload });

    form.reset();
  };

  return (
    <DialogFormWrapper
      title='Редактировать шаблон'
      isOpen={searchParams.has('update-template')}
      onSubmit={submitHandler}
      requestStatus={requestStatus}
    >
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

      {/*
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
      */}

    </DialogFormWrapper>
  );
}
