import { FormEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
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
  const [createSubscriptionTemplate, requestStatus] = useCreateSubscriptionTemplateMutation();
  const [formValidation, setFormValidation] = useState({
    title: true,
    price: true,
    visits: true,
    // duration: true,
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
      // duration: true,
    });

    const errorName = validateForm(formData);
    if (errorName) {
      setFormValidation(() => ({
        ...formValidation,
        [errorName]: false,
      }));
      return;
    }

    createSubscriptionTemplate({
      title: formData.title as string,
      price: +formData.price as number,
      visits: +formData.visits as number,
      // duration: calculateDuration(),
    });
  };

  return (
    <DialogFormWrapper
      title='Добавить шаблон'
      isOpen={searchParams.has('create-subscription-template')}
      onSubmit={submitHandler}
      requestStatus={requestStatus}
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

    </DialogFormWrapper>
  );
}
