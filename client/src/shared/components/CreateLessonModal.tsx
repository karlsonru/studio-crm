import { useState, FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select/Select';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getDayName } from '../helpers/getDayName';
import { useCreateLessonMutation, useGetLocationsQuery, useGetUsersQuery } from '../api';

function getDefaultDate(now: Date, shift?: number) {
  return `${now.getFullYear() + (shift ?? 0)}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
}

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
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [searchParams, setSearchParams] = useSearchParams();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [createLesson, { isSuccess, isError, data }] = useCreateLessonMutation();
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

    createLesson({
      title: formData.title as string,
      teacher: formData.teacher as string,
      location: formData.location as string,
      day: +formData.day,
      timeStart: +(formData.timeStart as string).replace(':', ''),
      timeEnd: +(formData.timeEnd as string).replace(':', ''),
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
    <Dialog open={searchParams.has('create-lesson')} onClose={() => setSearchParams('')}>
      <DialogTitle>Добавить занятие</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Stack py={1} direction="column" spacing={2} width={isMobile ? 'auto' : 500}>
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
              <Select name='day' label='День недели' defaultValue={now.getDay()} fullWidth required>
                { [1, 2, 3, 4, 5, 6, 0].map(
                  (num) => <MenuItem
                  key={getDayName(num)}
                  value={num}>
                      {getDayName(num)}
                    </MenuItem>,
                )}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel sx={{ margin: '1rem 0' }}>Время занятия</FormLabel>
              <Stack direction='row'>
                <TextField
                  name='timeStart'
                  type='time'
                  required
                  label={isMobile ? 'Начало' : ''}
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
                  required
                  error={!formValidation.timeEnd}
                  helperText={!formValidation.timeEnd ? 'Время должно быть больше времени начала' : ''}
                  label={isMobile ? 'Конец' : ''}
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
              <Select name='location' label='Помещение' defaultValue='location 1' fullWidth required>
              { isLocationsSuccess
                  && locationsData.payload.map((location) => (
                    <MenuItem key={location._id} value={location._id}>{location.title}</MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FormControl error={!formValidation.teacher} fullWidth>
              <FormLabel sx={{ marginTop: '1rem' }}>Педагог</FormLabel>
              <Select name='teacher' label='Педагог' defaultValue='' required>
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
                <TextField name='dateFrom' type='date' required
                  defaultValue={getDefaultDate(now)}
                  label={isMobile ? 'Начало' : ''}
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>{!isMobile && 'Начало'}</InputAdornment>,
                  }}
                  InputLabelProps={{ shrink: true }}
                  />
                <TextField name='dateTo' type='date' required
                  defaultValue={getDefaultDate(now, 1)}
                  label={isMobile ? 'Конец' : ''}
                  error={!formValidation.dateTo}
                  helperText={!formValidation.dateTo ? 'Дата должна быть после даты начала' : ''}
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>{!isMobile && 'Конец'}</InputAdornment>,
                  }}
                  InputLabelProps={{ shrink: true }}
                  />
              </Stack>
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
