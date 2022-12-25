import { Dispatch, SetStateAction } from 'react';
import {
  useForm,
  Controller,
  SubmitHandler,
  FieldValues,
} from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select/Select';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import DialogActions from '@mui/material/DialogActions';
import { getDayName } from '../helpers/getDayName';
import { useMediaQuery } from '@mui/material';

/*
{
  "title": "Изо вт 11-14",
  "teacher": "63540d17460f2b088105e004",
  "activeStudents": 1,
  "location": "63542092fca363139570253d",
  "day": 1,
  "timeStart": 1600,
  "timeEnd": 1720,
  "dateFrom": 1661979600000,
  "dateTo": 1693515600000,
  "isActive": true
}
*/

interface ICreateLessonModal {
  isOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

const now = new Date();

const deafultValues = {
  title: '',
  size: 'group',
  day: now.getDay(),
  teacher: {},
  location: {},
  timeStart: '',
  timeEnd: '',
  dateFrom: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
  dateTo: `${now.getFullYear() + 1}-${now.getMonth() + 1}-${now.getDate()}`,
};

export function CreateLessonModal({ isOpen, setModalOpen }: ICreateLessonModal) {
  const isMobile = useMediaQuery('(max-width: 767px)');

  const {
    register,
    handleSubmit,
    control,
  } = useForm();

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleCancel = () => {
    handleClose();
  };

  const handleOk: SubmitHandler<FieldValues> = (data: any) => {
    console.log('submited');
    console.log(data);
  };

  const now = new Date();

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Добавить занятие</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleOk)} style={{ paddingTop: '0.5rem' }}>
          <Controller
            name='title'
            control={control}
            render={({ field }) => <TextField fullWidth {...field} label="Занятие" placeholder="Занятие" required />}
          />

          <TextField
            {...register('title')}
            name='title'
            label='Занятие'
            placeholder='Занятие'
            autoFocus
            fullWidth
            required
            // eslint-disable-next-line no-return-assign
            onBlur={(event) => (event.target.value = event.target.value.trim())}
            inputProps={{
              minLength: 3,
            }}
          />


          <Controller
            name='size'
            control={control}
            render={({ field }) => (
              <>
                <InputLabel>Тип занятия</InputLabel>
                <RadioGroup row {...field}>
                  <FormControlLabel value="group" control={<Radio required />} label="Группа" />
                  <FormControlLabel value="individual" control={<Radio required />} label="Индивидуальное" />
                </RadioGroup>
              </>
            )}
          />

          <Controller
            name='day'
            control={control}
            render={({ field }) => (
              <>
                <InputLabel>День недели</InputLabel>
                <Select label="День недели" fullWidth {...field} required>
                  { [1, 2, 3, 4, 5, 6, 0].map(
                    (num) => <MenuItem
                    key={getDayName(num)}
                    value={num.toString()}>
                        {getDayName(num)}
                      </MenuItem>,
                  )}
                </Select>
              </>
            )}
          />

          <Stack direction='row'>
            <Controller
              name='timeStart'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type='time'
                  label='Начало'
                  inputProps={{
                    endAdornment: <InputAdornment position='end'>Начало</InputAdornment>,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    minWidth: '120px',
                    flexBasis: '50%',
                  }} />
              )}
            />

            <Controller
              name='timeEnd'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type='time'
                  label='Конец'
                  inputProps={{
                    endAdornment: <InputAdornment position='end'>Конец</InputAdornment>,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    minWidth: '120px',
                    flexBasis: '50%',
                  }} />
              )}
            />
          </Stack>

          <Controller
            name='location'
            control={control}
            render={({ field }) => (
              <>
                <InputLabel>Помещение</InputLabel>
                <Select {...field} label='Помещение'>
                  <MenuItem value={'location 1'}>location 1</MenuItem>
                  <MenuItem value={'location 2'}>location 2</MenuItem>
                </Select>
              </>
            )}
          />

          <Controller
            name='teacher'
            control={control}
            render={({ field }) => (
              <>
                <InputLabel>Педагог</InputLabel>
                <Select {...field} label='Педагог'>
                  <MenuItem value={'Педагог 1'}>Педагог 1</MenuItem>
                  <MenuItem value={'Педагог 2'}>Педагог 2</MenuItem>
                </Select>
              </>
            )}
          />

          <Stack direction='row'>
            <Controller
              name='dateFrom'
              control={control}
              render={({ field }) => (
                <TextField {...field} type='date' inputProps={{
                  endAdornment: <InputAdornment position='end'>Начало</InputAdornment>,
                }} />
              )}
            />
            <Controller
              name='dateTo'
              control={control}
              render={({ field }) => (
                <TextField {...field} type='date' inputProps={{
                  endAdornment: <InputAdornment position='end'>Начало</InputAdornment>,
                }} />
              )}
            />
          </Stack>

          <DialogActions sx={{ paddingRight: '0' }}>
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
