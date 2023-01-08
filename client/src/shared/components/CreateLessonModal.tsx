import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from 'react';
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
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import { useMediaQuery } from '@mui/material';
import { getDayName } from '../helpers/getDayName';
import { useCreateLessonMutation, useGetLocationsQuery, useGetUsersQuery } from '../api';

interface ICreateLessonModal {
  isOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

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

  if (Date.parse(formData.dateFrom as string) > Date.parse(formData.dateTo as string)) {
    return 'dateTo';
  }

  return '';
}

export function CreateLessonModal({ isOpen, setModalOpen }: ICreateLessonModal) {
  const isMobile = useMediaQuery('(max-width: 767px)');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [createLesson, { isSuccess, isError, data }] = useCreateLessonMutation();
  const { data: locationsData, isSuccess: isLocationsSuccess } = useGetLocationsQuery();
  const { data: usersData, isSuccess: isUsersSuccess } = useGetUsersQuery();

  const [formValidation, setFormValidation] = useState({
    title: true,
    timeEnd: true,
    dateTo: true,
  });

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleCancel = () => {
    handleClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(form).entries());

    setFormValidation({
      title: true,
      timeEnd: true,
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
      dateFrom: +Date.parse(formData.dateFrom as string),
      dateTo: +Date.parse(formData.dateTo as string),
      isActive: true,
    });
    form.reset();
  };

  const now = new Date();

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Добавить занятие</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} style={{ paddingTop: '0.5rem' }}>
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

          <InputLabel sx={{ marginTop: '1rem' }}>Тип занятия</InputLabel>
          <RadioGroup row name='size' defaultValue='group'>
            <FormControlLabel value='group' control={<Radio required />} label='Группа' />
            <FormControlLabel value='individual' control={<Radio required />} label='Индивидуальное' />
          </RadioGroup>

          <InputLabel sx={{ marginTop: '1rem' }}>День недели</InputLabel>
          <Select name='day' label='День недели' defaultValue={now.getDay()} fullWidth required>
            { [1, 2, 3, 4, 5, 6, 0].map(
              (num) => <MenuItem
              key={getDayName(num)}
              value={num}>
                  {getDayName(num)}
                </MenuItem>,
            )}
          </Select>

          <InputLabel sx={{ margin: '1rem 0' }}>Время занятия</InputLabel>
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

          <InputLabel sx={{ marginTop: '1rem' }}>Помещение</InputLabel>
          <Select name='location' label='Помещение' defaultValue='location 1' fullWidth required>
          { isLocationsSuccess
              && locationsData.payload.map((location) => (
                <MenuItem key={location._id} value={location._id}>{location.title}</MenuItem>
              ))}
          </Select>

          <InputLabel sx={{ marginTop: '1rem' }}>Педагог</InputLabel>
          <Select name='teacher' label='Педагог' defaultValue='' fullWidth required>
            <MenuItem value={''}><em>Укажите педагога</em></MenuItem>
            { isUsersSuccess
              && usersData.payload.map((user) => (
                <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
              ))}
          </Select>

          <InputLabel sx={{ margin: '1rem 0' }}>Даты занятия</InputLabel>
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

          <DialogActions sx={{ paddingRight: '0', marginTop: '1rem' }}>
            <Button autoFocus variant='contained' color='error' onClick={handleCancel}>
              Закрыть
            </Button>
            <Button type='submit' variant='contained' color='success'>Подтвердить</Button>
          </DialogActions>

         </form>
       </DialogContent>
    </Dialog>
  );
}
