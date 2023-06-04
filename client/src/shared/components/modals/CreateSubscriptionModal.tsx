import { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import { DialogFormWrapper } from '../DialogFormWrapper';
import {
  useCreateSubscriptionMutation,
  useGetStudentsQuery,
  useGetSubscriptionTemplatesQuery,
  useGetLessonsQuery,
} from '../../api';
import { useMobile } from '../../hooks/useMobile';
import { Loading } from '../Loading';

export function CreateSubscriptionModal() {
  const isMobile = useMobile();
  const [searchParams, setSearchParams] = useSearchParams();

  const [createSubsciption] = useCreateSubscriptionMutation();
  const { data: studentsData } = useGetStudentsQuery();
  const { data: templatesData } = useGetSubscriptionTemplatesQuery();
  const { data: lessonsData } = useGetLessonsQuery();

  const handleClose = () => setSearchParams(undefined);

  if (!templatesData || !studentsData || !lessonsData) return <Loading />;

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

    const dateFromTimestamp = Date.parse(formData.dateFrom as string);

    createSubsciption({
      template: template._id,
      visitsLeft: template.visits,
      student: student._id,
      lesson: lesson._id,
      paymentMethod: formData.paymentMethod as string,
      dateFrom: dateFromTimestamp,
      dateTo: dateFromTimestamp + template.duration,
      isActive: true,
    });

    console.log('reset');
    form.reset();
  };

  return (
    <DialogFormWrapper
      title='Оформить абонемент'
      isOpen={searchParams.has('create-subscription')}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
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
          label="Способ оплаты"
          defaultValue="card"
          required
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
          label={isMobile ? 'Начало' : ''}
          defaultValue={format(new Date(), 'Y-MM-dd')}
          required
          InputProps={{
            endAdornment: <InputAdornment position='end'>{!isMobile && 'Начало'}</InputAdornment>,
          }}
          InputLabelProps={{ shrink: true }}
          />
      </FormControl>

    </DialogFormWrapper>
  );
}
