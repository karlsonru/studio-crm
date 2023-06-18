import { FormEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/system/Stack';
import { NumberField } from '../fields/NumberField';
import { DialogFormWrapper } from '../DialogFormWrapper';
import { useCreateSubscriptionTemplateMutation } from '../../api';

function validateForm(formData: { [key: string]: FormDataEntryValue }) {
  if (!formData.title || (formData.title as string).trim().length < 3) {
    return 'fullname';
  }

  if (!formData.price || (+formData.price as number) < 0) {
    return 'price';
  }

  return '';
}

export function CreateSubscriptionTemplateModal() {
  const [searchParams] = useSearchParams();
  const [
    createSubscriptionTemplate,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { isSuccess, isError },
  ] = useCreateSubscriptionTemplateMutation();
  const [formValidation, setFormValidation] = useState({
    title: true,
    price: true,
    visits: true,
    duration: true,
  });

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

    const calculateDuration = () => {
      const day = 86400000; // длительность дня в милисекундах
      switch (formData.period) {
        case 'month':
          return +formData.duration * day * 30;
        case 'week':
          return +formData.duration * day * 7;
        case 'day':
          return +formData.duration * day;
        default:
          return 0;
      }
    };

    createSubscriptionTemplate({
      title: formData.title as string,
      price: +formData.price as number,
      visits: +formData.visits as number,
      duration: calculateDuration(),
    });

    form.reset();
  };

  return (
    <DialogFormWrapper
      title='Добавить шаблон'
      isOpen={searchParams.has('create-subscription-template')}
      onSubmit={submitHandler}
    >
      <TextField
        variant="outlined"
        name="title"
        label="Название"
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
      />
      <NumberField
        name="visits"
        label="Количество занятий"
        error={!formValidation.visits}
        minValue={1}
      />

      <FormControl>
        <FormLabel sx={{ mb: 1 }}>Период</FormLabel>

        <Stack direction="row">
          <NumberField
            name="duration"
            label="Длительность"
            error={!formValidation.duration}
            minValue={1}
          />

          <Select
            name="period"
            defaultValue="month"
            sx={{ flexGrow: 1, minWidth: '115px' }}
          >
            <MenuItem value="day">Дней</MenuItem>
            <MenuItem value="week">Недель</MenuItem>
            <MenuItem value="month">Месяцев</MenuItem>
          </Select>
        </Stack>

      </FormControl>

    </DialogFormWrapper>
  );
}
