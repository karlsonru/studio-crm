import { useState, FormEvent } from 'react';
import { format } from 'date-fns';
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
import EditIcon from '@mui/icons-material/Edit';
import { getDayName } from '../../shared/helpers/getDayName';
import {
  useGetLocationsQuery,
  useGetUsersQuery,
  useGetLessonQuery,
  usePatchLessonMutation,
} from '../../shared/api';
import { useMobile } from '../../shared/hooks/useMobile';
import { SubmitButton } from '../../shared/components/buttons/SubmitButton';
import { convertTime } from '../../shared/helpers/convertTime';
import { FormContentColumn } from '../../shared/components/FormContentColumn';

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

export function ContentTabDetails({ lessonId }: { lessonId: string }) {
  const isMobile = useMobile();
  const [isEdit, setEdit] = useState(false);

  const { data: lessonDetails } = useGetLessonQuery(lessonId);
  const [updateLesson] = usePatchLessonMutation();
  const { data: locationsData, isSuccess: isLocationsSuccess } = useGetLocationsQuery();
  const { data: usersData, isSuccess: isUsersSuccess } = useGetUsersQuery();

  const [formValidation, setFormValidation] = useState({
    title: true,
    timeEnd: true,
    teacher: true,
    dateTo: true,
  });

  if (!lessonDetails) {
    return null;
  }

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

    updateLesson({
      id: lessonId,
      newItem: {
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
      },
    });

    setEdit(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormContentColumn>
        <Stack
          direction='row'
          justifyContent='end'
        >
          <Button
            variant='contained'
            color='primary'
            startIcon={<EditIcon />}
            onClick={() => setEdit((prev) => !prev)}
          >
            { isEdit ? 'Отменить редактирование' : 'Редактировать' }
          </Button>
        </Stack>

        <TextField
          name='title'
          label='Занятие'
          placeholder='Занятие'
          defaultValue={lessonDetails.title}
          disabled={!isEdit}
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
            <FormControlLabel
              value='group'
              label='Группа'
              control={<Radio required />}
              disabled={!isEdit}
            />
            <FormControlLabel
              value='individual'
              label='Индивидуальное'
              control={<Radio required />}
              disabled={!isEdit}
            />
          </RadioGroup>
        </FormControl>

        <FormControl>
          <FormLabel>День недели</FormLabel>
          <Select
            name='day'
            label='День недели'
            defaultValue={lessonDetails.day}
            disabled={!isEdit}
            fullWidth
            required
          >
            { [1, 2, 3, 4, 5, 6, 0].map(
              (num) => (
                <MenuItem
                  key={getDayName(num)}
                  value={num}>
                    {getDayName(num)}
                  </MenuItem>
              ),
            )}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel sx={{ margin: '1rem 0' }}>Время занятия</FormLabel>
          <Stack direction='row'>
            <TextField
              name='timeStart'
              label={isMobile ? 'Начало' : ''}
              type='time'
              required
              disabled={!isEdit}
              InputProps={{
                endAdornment: <InputAdornment position='end'>{!isMobile && 'Начало'}</InputAdornment>,
              }}
              inputProps={{
                step: 300,
                min: '09:00',
                max: '21:55',
                defaultValue: convertTime(lessonDetails.timeStart),
              }}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                minWidth: '120px',
                flexBasis: '50%',
              }}
            />

            <TextField
              name='timeEnd'
              label={isMobile ? 'Конец' : ''}
              type='time'
              required
              disabled={!isEdit}
              error={!formValidation.timeEnd}
              helperText={!formValidation.timeEnd ? 'Время должно быть больше времени начала' : ''}
              InputProps={{
                endAdornment: <InputAdornment position='end'>{!isMobile && 'Конец'}</InputAdornment>,
              }}
              inputProps={{
                step: 300,
                min: '09:05',
                max: '22:00',
                defaultValue: convertTime(lessonDetails.timeEnd),
              }}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                minWidth: '120px',
                flexBasis: '50%',
              }}
            />
          </Stack>
        </FormControl>

        <FormControl>
          <FormLabel>Помещение</FormLabel>
          <Select
            name='location'
            label='Помещение'
            defaultValue={lessonDetails.location._id}
            disabled={!isEdit}
            fullWidth
            required
          >
          { isLocationsSuccess
              && locationsData.map((location) => (
                <MenuItem key={location._id} value={location._id}>{location.title}</MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl error={!formValidation.teacher} fullWidth>
          <FormLabel sx={{ marginTop: '1rem' }}>Педагог</FormLabel>
          <Select
            name='teacher'
            label='Педагог'
            defaultValue={lessonDetails.teacher._id}
            disabled={!isEdit}
            required
          >
            <MenuItem value={''}><em>Укажите педагога</em></MenuItem>
            { isUsersSuccess
              && usersData.map((user) => (
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
              label={isMobile ? 'Начало' : ''}
              type='date'
              defaultValue={format(lessonDetails.dateFrom, 'Y-MM-dd')}
              disabled={!isEdit}
              required
              InputProps={{
                endAdornment: <InputAdornment position='end'>{!isMobile && 'Начало'}</InputAdornment>,
              }}
              InputLabelProps={{ shrink: true }}
              />
            <TextField
              name='dateTo'
              label={isMobile ? 'Конец' : ''}
              type='date'
              defaultValue={format(lessonDetails.dateTo, 'Y-MM-dd')}
              disabled={!isEdit}
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

        <SubmitButton
          content={'Подтвердить'}
          props={{
            disabled: !isEdit,
          }}
        />

      </FormContentColumn>
    </form>
  );
}
