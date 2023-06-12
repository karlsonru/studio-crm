import { useState, FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { addYears, format } from 'date-fns';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select/Select';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { getDayName } from '../../helpers/getDayName';
import { useCreateLessonMutation, useGetLocationsQuery, useGetUsersQuery } from '../../api';
import { useMobile } from '../../hooks/useMobile';
import { DialogFormWrapper } from '../DialogFormWrapper';

function validateFrom(formData: { [key: string]: FormDataEntryValue }) {
  if ((formData.title as string).trim().length < 3) {
    return 'title';
  }

  const { timeStart, timeEnd } = formData;
  if ((timeStart as string).split(':')[0] > (timeEnd as string).split(':')[0]) {
    return 'timeEnd';
  }

  if (((timeStart as string).split(':')[0] === (timeEnd as string).split(':')[0])
      && ((timeStart as string).split(':')[1] >= (timeEnd as string).split(':')[1])) {
    return 'timeEnd';
  }

  if (!formData.teacher) {
    return 'teacher';
  }

  if (Date.parse(formData.dateFrom as string) > Date.parse(formData.dateTo as string)) {
    return 'dateTo';
  }

  return '';
}

export function CreateLessonModal() {
  const isMobile = useMobile();
  const [searchParams] = useSearchParams();

  const [createLesson] = useCreateLessonMutation();
  const { data: locationsData, isSuccess: isLocationsSuccess } = useGetLocationsQuery();
  const { data: usersData, isSuccess: isUsersSuccess } = useGetUsersQuery();

  const [formValidation, setFormValidation] = useState({
    title: true,
    timeEnd: true,
    teacher: true,
    dateTo: true,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(form).entries());

    setFormValidation({
      title: true,
      timeEnd: true,
      teacher: true,
      dateTo: true,
    });

    const errorName = validateFrom(formData);
    if (errorName) {
      setFormValidation(() => ({
        ...formValidation,
        [errorName]: false,
      }));
      return;
    }

    const timeStart = (formData.timeStart as string).split(':');
    const timeEnd = (formData.timeEnd as string).split(':');

    createLesson({
      title: formData.title as string,
      teacher: formData.teacher as string,
      location: formData.location as string,
      day: +formData.day,
      timeStart: {
        hh: +timeStart[0],
        min: +timeStart[1],
      },
      timeEnd: {
        hh: +timeEnd[0],
        min: +timeEnd[1],
      },
      activeStudents: 0,
      students: [],
      dateFrom: +Date.parse(formData.dateFrom as string),
      dateTo: +Date.parse(formData.dateTo as string),
      isActive: true,
    });
    form.reset();
  };

  const now = new Date();

  return (
    <DialogFormWrapper
      title='Добавить занятие'
      isOpen={searchParams.has('create-lesson')}
      onSubmit={handleSubmit}
    >
      <TextField
        name='title'
        label='Занятие'
        placeholder='Занятие'
        autoFocus
        fullWidth
        required
        error={!formValidation.title}
        helperText={!formValidation.title ? 'Укажите название не менее 3х символов' : ''}
        inputProps={{
          minLength: 3,
        }}
      />

      <FormControl>
        <FormLabel>Тип занятия</FormLabel>
        <RadioGroup row name='size' defaultValue='group'>
          <FormControlLabel value='group' control={<Radio required />} label='Группа' />
          <FormControlLabel value='individual' control={<Radio required />} label='Индивидуальное' />
        </RadioGroup>
      </FormControl>

      <FormControl>
        <FormLabel>День недели</FormLabel>
        <Select
          name='day'
          label='День недели'
          defaultValue={now.getDay()}
          fullWidth
          required
        >
          { [1, 2, 3, 4, 5, 6, 0].map(
            (num) => (
            <MenuItem
              key={getDayName(num)}
              value={num}>
                {getDayName(num)}
            </MenuItem>),
          )}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel sx={{ margin: '1rem 0' }}>Время занятия</FormLabel>
        <Stack direction='row'>
          <TextField
            name='timeStart'
            type='time'
            label={isMobile ? 'Начало' : ''}
            required
            InputProps={{
              endAdornment: <InputAdornment position='end'>{!isMobile && 'Начало'}</InputAdornment>,
            }}
            inputProps={{
              step: 300,
              min: '09:00',
              max: '21:55',
            }}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              minWidth: '120px',
              flexBasis: '50%',
            }} />

          <TextField
            name='timeEnd'
            type='time'
            label={isMobile ? 'Конец' : ''}
            required
            error={!formValidation.timeEnd}
            helperText={!formValidation.timeEnd ? 'Время должно быть больше времени начала' : ''}
            InputProps={{
              endAdornment: <InputAdornment position='end'>{!isMobile && 'Конец'}</InputAdornment>,
            }}
            inputProps={{
              step: 300,
              min: '09:05',
              max: '22:00',
            }}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              minWidth: '120px',
              flexBasis: '50%',
            }} />
        </Stack>
      </FormControl>

      <FormControl>
        <FormLabel>Помещение</FormLabel>
        <Select
          name='location'
          label='Помещение'
          defaultValue='location 1'
          fullWidth
          required
        >
        { isLocationsSuccess
            && locationsData.payload.map((location) => (
              <MenuItem key={location._id} value={location._id}>{location.title}</MenuItem>
            ))}
        </Select>
      </FormControl>

      <FormControl error={!formValidation.teacher} fullWidth>
        <FormLabel sx={{ marginTop: '1rem' }}>Педагог</FormLabel>
        <Select
          name='teacher'
          label='Педагог'
          defaultValue=''
          required
        >
          <MenuItem value={''}><em>Укажите педагога</em></MenuItem>
          { isUsersSuccess
            && usersData.payload.map((user) => (
              <MenuItem key={user._id} value={user._id}>{user.fullname}</MenuItem>
            ))}
        </Select>
        {!formValidation.teacher && <FormHelperText>Выберите педагога</FormHelperText>}
      </FormControl>

      <FormControl>
        <FormLabel>Даты занятия</FormLabel>
        <Stack direction='row'>
          <TextField
            name='dateFrom'
            type='date'
            label={isMobile ? 'Начало' : ''}
            defaultValue={format(now, 'Y-MM-dd')}
            required
            InputProps={{
              endAdornment: <InputAdornment position='end'>{!isMobile && 'Начало'}</InputAdornment>,
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name='dateTo'
            type='date'
            label={isMobile ? 'Конец' : ''}
            defaultValue={format(addYears(now, 1), 'Y-MM-dd')}
            required
            error={!formValidation.dateTo}
            helperText={!formValidation.dateTo ? 'Дата должна быть после даты начала' : ''}
            InputProps={{
              endAdornment: <InputAdornment position='end'>{!isMobile && 'Конец'}</InputAdornment>,
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </FormControl>

    </DialogFormWrapper>
  );
}
