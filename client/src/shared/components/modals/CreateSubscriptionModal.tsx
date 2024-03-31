import { FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eachDayOfInterval, format, lastDayOfMonth } from 'date-fns';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import { ISubscriptionTemplateModel } from 'shared/models/ISubscriptionModel';
import { DialogFormWrapper } from '../DialogFormWrapper';
import {
  useCreateSubscriptionMutation,
  useGetStudentsQuery,
  useGetSubscriptionTemplatesQuery,
  useGetLessonsQuery,
} from '../../api';
import { useMobile } from '../../hooks/useMobile';
import { ILessonModel } from '../../models/ILessonModel';
import { INPUT_DATE_FORMAT } from '../../constants';

// TODO ммплементация шаблона с одним занятием
// TODO проверка есть ли задолженность у ученика

function ShowDebt() {
  return <></>;
}

export function CreateSubscriptionModal() {
  const isMobile = useMobile();
  const [searchParams] = useSearchParams();

  const [price, setPrice] = useState<string | number>('');
  const [visitsTotal, setVisitsTotal] = useState<string | number>('');
  const [selectedLessons, setSelectedLessons] = useState<Array<ILessonModel>>([]);
  const [dateFrom, setDateFrom] = useState(format(new Date(), INPUT_DATE_FORMAT));
  const [selectedTemplate, setSelectedTemplate] = useState<ISubscriptionTemplateModel | null>(null);

  const lastDate = lastDayOfMonth(Date.parse(dateFrom));

  // изменим цену в price при изменении шаблона или даты
  useEffect(() => {
    if (!selectedTemplate) return;

    // для разового абонемента, не нужно считать сколько занятий осталось до конца месяца / цену
    if (selectedTemplate.visits === 1) {
      setPrice(selectedTemplate.price);
      setVisitsTotal(selectedTemplate.visits);
      return;
    }

    // получим интервал дней с dateFrom до конца месяца
    const interval = eachDayOfInterval({
      start: Date.parse(dateFrom),
      end: lastDate,
    });

    // узнаем дни недели в которые будут проходить выбранные занятия
    const selectedLessonsDays = selectedLessons.map((selectedLesson) => selectedLesson.weekday);

    // узнаем количество этих дней недели до конца интервала
    const possibleVisits = interval.filter((date) => selectedLessonsDays.includes(date.getDay()));

    const oneVisitPrice = Math.round(selectedTemplate.price / selectedTemplate.visits);

    setPrice(possibleVisits.length * oneVisitPrice);
    setVisitsTotal(possibleVisits.length);
  }, [selectedLessons, selectedTemplate, dateFrom]);

  // здесь пересчитываем цену при самостоятельном изменении количества визитом
  useEffect(() => {
    if (!selectedTemplate) return;

    const oneVisitPrice = Math.round(selectedTemplate.price / selectedTemplate.visits);
    setPrice(+visitsTotal * oneVisitPrice);
  }, [visitsTotal]);

  const [createSubsciption, requestStatus] = useCreateSubscriptionMutation();
  const { data: studentsData, isLoading: isLoadingStudents } = useGetStudentsQuery();
  const { data: templatesData, isLoading: isLoadingTemplates } = useGetSubscriptionTemplatesQuery();
  const { data: lessonsData, isLoading: isLoadingLessons } = useGetLessonsQuery();

  if (!studentsData || !templatesData || !lessonsData) return null;

  const changePriceHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/, '');
    setPrice(input);
  };

  const changeVisitsHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/, '');
    setVisitsTotal(input);
  };

  // при закрытии вернём State к default'ным значениям
  const clearState = () => {
    setPrice('');
    setVisitsTotal('');
    setSelectedLessons([]);
    setSelectedTemplate(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(form).entries());

    const student = studentsData?.find(
      (selectedStudent) => selectedStudent.fullname === formData.student,
    );

    if (!selectedTemplate || !student || !selectedLessons.length) {
      console.error('Something went wrong. Not selected template, student or lesson');
      console.debug(`Template title: ${selectedTemplate?.title}`);
      console.debug(`Student fullname: ${student?.fullname}`);
      console.debug(`Selected lessons length: ${selectedLessons.length}`);
      return;
    }

    const dateFromTimestamp = Date.parse(formData.dateFrom as string);

    createSubsciption({
      student: student._id,
      lessons: selectedLessons.map((lesson) => lesson._id),
      price: +price,
      visitsTotal: +visitsTotal,
      visitsPostponed: 0,
      visitsLeft: +visitsTotal,
      dateFrom: dateFromTimestamp,
      dateTo: Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + 1),
      paymentMethod: formData.paymentMethod as string,
    });

    form.reset();
  };

  return (
    <DialogFormWrapper
      title='Оформить абонемент'
      isOpen={searchParams.has('create-subscription')}
      onSubmit={handleSubmit}
      requestStatus={requestStatus}
      onClose={clearState}
    >

      <DialogContentText variant="subtitle2" fontSize="1.25rem">
        Абонемент с <b>{dateFrom}</b> до <b>{format(lastDate, 'dd-MM-yyy')}</b>
      </DialogContentText>
      <DialogContentText variant="subtitle2" fontSize="1.25rem">
        Стоимость <b>{price}</b>
      </DialogContentText>
      <DialogContentText variant="subtitle2" fontSize="1.25rem">
        Посещений <b>{visitsTotal}</b>
      </DialogContentText>

      <Autocomplete
        loading={isLoadingTemplates}
        options={templatesData}
        getOptionLabel={(option) => option.title}
        renderInput={(params) => <TextField {...params} required name="template" label="Шаблон" />}
        onChange={(event, value) => setSelectedTemplate(value)}
      />

      <Autocomplete
        loading={isLoadingStudents}
        options={studentsData}
        getOptionLabel={(option) => option.fullname}
        renderInput={(params) => <TextField {...params} required name="student" label="Студент" />}
      />

      <Autocomplete
        multiple
        loading={isLoadingLessons}
        options={lessonsData}
        getOptionLabel={(option) => option.title}
        renderInput={(params) => <TextField {...params} name="lesson" label="Занятие" />}
        onChange={(event, value) => setSelectedLessons(value)}
      />

      <TextField
        name="price"
        label="Стоимость"
        value={price}
        onChange={changePriceHandler}
        // disabled={selectedTemplate?.visits === 1}
        required
      />

      <TextField
        name="comment"
        label="Комментарий"
      />

      <TextField
        name="visitsTotal"
        label="Посещений"
        value={visitsTotal}
        onChange={changeVisitsHandler}
        // disabled={selectedTemplate?.visits === 1}
        required
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
          value={dateFrom}
          onChange={(event) => setDateFrom(event.target.value)}
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
