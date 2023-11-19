import { useState, FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, parse } from 'date-fns';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select/Select';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import { useCreateFinanceMutation, useGetLocationsQuery } from '../../api';
import { DialogFormWrapper } from '../DialogFormWrapper';
import { NumberField } from '../fields/NumberField';

function validateFrom(formData: { [key: string]: FormDataEntryValue }) {
  if ((formData.title as string).trim().length < 3) {
    return 'title';
  }

  return '';
}

export function CreateFinanceExpenseModal() {
  const [searchParams] = useSearchParams();

  const [createExpense] = useCreateFinanceMutation();
  const { data: locationsData, isSuccess: isLocationsSuccess } = useGetLocationsQuery();

  const [formValidation, setFormValidation] = useState({
    title: true,
    amount: true,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(form).entries());

    setFormValidation({
      title: true,
      amount: true,
    });

    const errorName = validateFrom(formData);
    if (errorName) {
      setFormValidation(() => ({
        ...formValidation,
        [errorName]: false,
      }));
      return;
    }

    createExpense({
      title: formData.title as string,
      amount: +formData.amount,
      date: parse(formData.date as string, 'yyyy-MM-dd', 0).getTime(),
      location: formData.location as string,
      comment: formData.comment as string,
    });

    form.reset();
  };

  return (
    <DialogFormWrapper
      title='Добавить расходы'
      isOpen={searchParams.has('create-expense')}
      onSubmit={handleSubmit}
    >
      <TextField
        name='title'
        label='Цель'
        placeholder='Цель'
        autoFocus
        fullWidth
        required
        error={!formValidation.title}
        helperText={!formValidation.title ? 'Укажите название не менее 3х символов' : ''}
        inputProps={{
          minLength: 3,
        }}
      />

      <NumberField
        name="amount"
        label="Сумма"
        error={false}
        minValue={0}
        props={{
          required: true,
        }}
      />

      <FormControl>
        <FormLabel>Помещение</FormLabel>
        <Select
          name='location'
          label='Помещение'
          defaultValue='common'
          fullWidth
          required
        >
        <MenuItem key="common" value="common">Общий</MenuItem>
        { isLocationsSuccess
            && locationsData.map((location) => (
              <MenuItem key={location._id} value={location._id}>{location.title}</MenuItem>
            ))}
        </Select>
      </FormControl>

      <TextField
        name='date'
        type='date'
        label='Дата'
        defaultValue={format(new Date(), 'yyyy-MM-dd')}
        required
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position='end'>Дата</InputAdornment>,
        }}
      />

      <TextField
        name='comment'
        label='Комментарий'
        placeholder='Комментарий'
        autoFocus
        fullWidth
        multiline
        minRows={3}
        inputProps={{
          minLength: 3,
        }}
      />

    </DialogFormWrapper>
  );
}
