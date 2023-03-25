import { FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CircleIcon from '@mui/icons-material/Circle';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { visitsPageActions } from '../../shared/reducers/visitsPageSlice';
import { useGetLessonQuery } from '../../shared/api';
import { useCreateVisitMutation } from '../../shared/api/visitsApi';

function StatusButton({ studentId }: { studentId: string }) {
  const [defaultStatus] = useState(1);
  const actions = useActionCreators(visitsPageActions);

  useEffect(() => {
    actions.setVisits({
      student: studentId,
      visitStatus: defaultStatus,
    });
  }, []);

  const changeHandler = (event: SelectChangeEvent<number>) => {
    actions.setVisits({
      student: studentId,
      visitStatus: event.target.value,
    });
  };

  return (
    <FormControl sx={{ width: '180px' }}>
      <InputLabel>Сатус</InputLabel>
      <Select
        defaultValue={defaultStatus}
        label="Статус"
        onChange={changeHandler}
      >
        <MenuItem value={1}>
          <CircleIcon color="success" fontSize="small" sx={{ marginRight: '0.5rem' }} />
          Посетил
        </MenuItem>
        <MenuItem value={2}>
          <CircleIcon color="error" fontSize="small" sx={{ marginRight: '0.5rem' }} />
          Пропустил
        </MenuItem>
        <MenuItem value={3}>
          <CircleIcon color="info" fontSize="small" sx={{ marginRight: '0.5rem' }} />
          Болел
        </MenuItem>
        <MenuItem value={4}>
          <CircleIcon color="warning" fontSize="small" sx={{ marginRight: '0.5rem' }} />
          К отработке
        </MenuItem>
      </Select>
    </FormControl>
  );
}

export function StudentsList() {
  const date = useAppSelector(
    (state) => state.visitsPageReducer.currentDateTimestamp,
  );
  const visits = useAppSelector(
    (state) => state.visitsPageReducer.visits,
  );

  const [createVisit] = useCreateVisitMutation();
  const [searchParams] = useSearchParams('');
  const lessonId = searchParams.get('lessonId') ?? '';

  // если это будущее - показываем кто должен прийти (кто записан в группы)
  // иначе покажем кто должен был прийти в день date
  const isFuture = date > Date.now();

  // если нет id или это прошедшее занятие - не делаем запрос к занятиям
  const {
    data, isFetching, isError, error,
  } = useGetLessonQuery(lessonId, {
    skip: !lessonId || !isFuture,
    selectFromResult: ((response) => response),
  });

  if (isFetching || !data?.payload || !lessonId) return null;

  if (isError) {
    console.error(error);
    return <h3>Не удалось получить список студентов</h3>;
  }

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createVisit({
      lesson: lessonId,
      teacher: data.payload.teacher._id,
      day: data.payload.day,
      date,
      students: visits,
    });
  };

  return (
    <form onSubmit={submitHandler} style={{ width: '100%', maxWidth: '600px' }}>
      <List>
        {
          data.payload.students.map((student) => (
          <ListItem key={student._id} divider={true}>
            <ListItemText primary={student.fullname} />
            <StatusButton studentId={student._id} />
          </ListItem>
          ))
        }
      </List>
      <Button
        type='submit'
        variant='contained'
        color='success'
        sx={{
          float: 'right',
          marginRight: '1rem',
        }}
      >
        Отметить
      </Button>
    </form>
  );
}
