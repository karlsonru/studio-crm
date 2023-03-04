import { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  useCreateSubscriptionMutation,
  useGetStudentsQuery,
  useGetSubscriptionTemplatesQuery,
  useGetLessonsQuery,
} from '../api';

function getDefaultDate(now: Date, shift?: number) {
  return `${now.getFullYear() + (shift ?? 0)}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
}

export function CreateSubscriptionModal() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [searchParams, setSearchParams] = useSearchParams();

  const [createSubsciption] = useCreateSubscriptionMutation();
  const { data: studentsData } = useGetStudentsQuery();
  const { data: templatesData } = useGetSubscriptionTemplatesQuery();
  const { data: lessonsData } = useGetLessonsQuery();

  if (!templatesData || !studentsData || !lessonsData) return <h1>Loading...</h1>;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(form).entries());

    const template = templatesData.payload.find((temp) => temp.title === formData.template);
    const student = studentsData.payload.find((std) => std.fullname === formData.student);
    const lesson = lessonsData.payload.find((les) => les.title === formData.lesson);

    if (!template || !student || !lesson) {
      console.error('template or student not found');
      return;
    }

    createSubsciption({
      template: template._id,
      price: template.price,
      visits: template.visits,
      duration: template.duration,
      student: student._id,
      lesson: lesson._id,
      paymentMethod: formData.paymentMethod as string,
      dateFrom: +Date.parse(formData.dateFrom as string),
      dateTo: +Date.parse(formData.dateFrom as string) + template.duration,
      isActive: true,
    });

    console.log('reset');
    form.reset();
  };

  return (
    <Dialog open={searchParams.has('create-subscription')} onClose={() => setSearchParams('')}>
      <DialogTitle>Оформить абонемент</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Stack py={1} direction="column" spacing={2} width={isMobile ? 'auto' : 500}>
            <Autocomplete
              options={templatesData.payload}
              getOptionLabel={(option) => option.title}
              renderInput={(params) => <TextField {...params} required name="template" label="Шаблон" />}
            />

            <Autocomplete
              options={studentsData.payload}
              getOptionLabel={(option) => option.fullname}
              renderInput={(params) => <TextField {...params} required name="student" label="Студент" />}
            />

            <Autocomplete
              options={lessonsData.payload}
              getOptionLabel={(option) => option.title}
              renderInput={(params) => <TextField {...params} required name="lesson" label="Занятие" />}
            />

            <FormControl fullWidth>
              <InputLabel>Способ оплаты</InputLabel>
              <Select
                name="paymentMethod"
                required
                label="Способ оплаты"
                defaultValue="card"
              >
                <MenuItem value='cash'>Наличные</MenuItem>
                <MenuItem value='card'>Карта</MenuItem>
                <MenuItem value='sbp'>СБП</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Дата начала</FormLabel>
              <TextField
                name='dateFrom'
                type='date'
                required
                defaultValue={getDefaultDate(new Date())}
                label={isMobile ? 'Начало' : ''}
                InputProps={{
                  endAdornment: <InputAdornment position='end'>{!isMobile && 'Начало'}</InputAdornment>,
                }}
                InputLabelProps={{ shrink: true }}
                />
            </FormControl>

            <DialogActions sx={{ paddingRight: '0' }}>
              <Button autoFocus variant='contained' color='error' onClick={() => setSearchParams('')}>
                Закрыть
              </Button>
              <Button type='submit' variant='contained' color='success'>Подтвердить</Button>
            </DialogActions>

          </Stack>
         </form>
       </DialogContent>
    </Dialog>
  );
}
