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
import { useCreateLessonMutation } from '../reducers/api';

/*
{
  'title': 'Изо вт 11-14',
  'teacher': '63540d17460f2b088105e004',
  'activeStudents': 1,
  'location': '63542092fca363139570253d',
  'day': 1,
  'timeStart': 1600,
  'timeEnd': 1720,
  'dateFrom': 1661979600000,
  'dateTo': 1693515600000,
  'isActive': true
}
*/

interface ICreateLessonModal {
  isOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

interface IFormData {
  title: string,
  size: string,
  day: string,
  timeStart: string,
  timeEnd: string,
  location: string,
  teacher: string,
  dateFrom: string,
  dateTo: string,
}

function validateFrom(formData: IFormData) {
  if (formData.title.trim().length < 3) {
    return { isValid: false, type: 'title' };
  }
  // eslint-disable-next-line no-param-reassign
  formData.title = formData.title.trim();

  const { timeStart, timeEnd } = formData;
  if (timeStart.split(':')[0] > timeEnd.split(':')[0]) {
    return { isValid: false, type: 'timeEnd' };
  }

  if ((timeStart.split(':')[0] === timeEnd.split(':')[0])
      && (timeStart.split(':')[1] >= timeEnd.split(':')[1])) {
    return { isValid: false, type: 'timeEnd' };
  }

  if (Date.parse(formData.dateFrom) > Date.parse(formData.dateTo)) {
    return { isValid: false, type: 'dateTo' };
  }

  return { isValid: true, type: null };
}

export function CreateLessonModal({ isOpen, setModalOpen }: ICreateLessonModal) {
  const isMobile = useMediaQuery('(max-width: 767px)');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [createLesson, { isSuccess, isError, data }] = useCreateLessonMutation();

  const [isValidTitle, setValidTitle] = useState(true);
  const [isValidEndTime, setValidEndTime] = useState(true);
  const [isValidEndDate, setValidEndDate] = useState(true);

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

    setValidTitle(true);
    setValidEndTime(true);
    setValidEndDate(true);

    // @ts-ignore
    const { isValid, type } = validateFrom(formData);

    if (isValid) {
      form.reset();
      // @ts-ignore
      createLesson(formData);
      return null;
    }

    switch (type) {
      case 'title':
        setValidTitle(false);
        break;
      case 'endTime':
        setValidEndTime(false);
        break;
      case 'dateTo':
        setValidEndDate(false);
        break;
      default:
    }
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
            error={!isValidTitle}
            helperText={isValidTitle ? '' : 'Укажите название не менее 3х символов'}
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
              error={!isValidEndTime}
              helperText={isValidEndTime ? '' : 'Время должно быть больше времени начала'}
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
            <MenuItem value={'location 1'}>location 1</MenuItem>
            <MenuItem value={'location 2'}>location 2</MenuItem>
          </Select>

          <InputLabel sx={{ marginTop: '1rem' }}>Педагог</InputLabel>
          <Select name='teacher' label='Педагог' defaultValue='' fullWidth required>
            <MenuItem value={''}><em>Укажите педагога</em></MenuItem>
            <MenuItem value={'Педагог 1'}>Педагог 1</MenuItem>
            <MenuItem value={'Педагог 2'}>Педагог 2</MenuItem>
          </Select>

          <InputLabel sx={{ margin: '1rem 0' }}>Даты занятия</InputLabel>
          <Stack direction='row'>
            <TextField name='dateFrom' type='date' required
              defaultValue={`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`}
              label={isMobile ? 'Начало' : ''}
              InputProps={{
                endAdornment: <InputAdornment position='end'>{!isMobile && 'Начало'}</InputAdornment>,
              }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField name='dateTo' type='date' required
              defaultValue={`${now.getFullYear() + 1}-${now.getMonth() + 1}-${now.getDate()}`}
              label={isMobile ? 'Конец' : ''}
              error={!isValidEndDate}
              helperText={isValidEndDate ? '' : 'Дата должна быть после даты начала'}
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
