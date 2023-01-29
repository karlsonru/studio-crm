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
import { useCreateSubscribtionTemplateMutation } from '../api';
import { useMobile } from '../hooks/useMobile';
import { NumberField } from './NumberField';

function validateForm(formData: { [key: string]: FormDataEntryValue }) {
  if (!formData.fullname || (formData.fullname as string).trim().length < 3) {
    return 'fullname';
  }

  if (!formData.contactName1 || (formData.contactName1 as string).trim().length < 2) {
    return 'hasContacts';
  }

  if (!formData.contactPhone1 || (formData.contactPhone1 as string).trim().length !== 11) {
    return 'validPhone';
  }

  return '';
}
/*
export function CreateStudentModal() {
  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(form).entries());

    validateForm(formData);

    setFormValidation({
      fullname: true,
      hasContacts: true,
      validPhone: true,
    });

    const errorName = validateForm(formData);
    if (errorName) {
      setFormValidation(() => ({
        ...formValidation,
        [errorName]: false,
      }));
      return;
    }

    const studentContacts = contacts.map((idx) => ({
      name: formData[`contactName${idx + 1}`] as string,
      phone: +(formData[`contactPhone${idx + 1}`] as string),
    }));

    createStudent({
      fullname: (formData.fullname as string).trim(),
      sex: formData.sex as string,
      birthday: +Date.parse(formData.birthday as string),
      balance: 0,
      visitingLessons: [],
      contacts: studentContacts,
      comment: (formData.comment as string).trim() ?? '',
      isActive: true,
    });

    form.reset();
  };
}
*/

export function CreateSubscribtionTemplateModal() {
  const isMobile = useMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const [
    createSubscribtionTemplate,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { isSuccess, isError },
  ] = useCreateSubscribtionTemplateMutation();
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
    console.log(formData);
  };

  return (
    <Dialog open={searchParams.has('create-subscribtion-template')} onClose={() => setSearchParams('')}>
      <DialogTitle>Добавить шаблон</DialogTitle>
      <DialogContent>
        <form onSubmit={submitHandler}>
          <Stack py={1} direction="column" spacing={2} width={isMobile ? 'auto' : 500}>
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

                <Select name="period" defaultValue="month" sx={{ flexGrow: 1 }}>
                  <MenuItem value="day">Дней</MenuItem>
                  <MenuItem value="week">Недель</MenuItem>
                  <MenuItem value="month">Месяцев</MenuItem>
                </Select>
              </Stack>

            </FormControl>

            </Stack>
          <DialogActions sx={{ paddingRight: '0' }}>
            <Button autoFocus variant='contained' color='error' onClick={() => setSearchParams('')}>
              Закрыть
            </Button>
            <Button type='submit' variant='contained' color='success'>Подтвердить</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
