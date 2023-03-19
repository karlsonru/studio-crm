import { useSearchParams } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { visitsPageActions } from '../../shared/reducers/visitsPageSlice';
import { useFindStudentsQuery } from '../../shared/api';

function StatusButton() {
  return (
    <FormControl sx={{ width: '140px' }}>
      <InputLabel id="demo-simple-select-label">Сатус</InputLabel>
      <Select
        defaultValue={1}
        label="Статус"
      >
        <MenuItem value={1}>Посетил</MenuItem>
        <MenuItem value={2}>Пропустил</MenuItem>
        <MenuItem value={3}>Болел</MenuItem>
        <MenuItem value={4}>К отработке</MenuItem>
      </Select>
    </FormControl>
  );
}

export function StudentsList() {
  const date = useAppSelector(
    (state) => state.visitsPageReducer.currentDateTimestamp,
  );
  const [searchParams] = useSearchParams('');
  const lessonId = searchParams.get('lessonId');

  // если это будущее - показываем кто должен прийти (кто записан в группы)
  // иначе покажем кто должен был прийти в день date
  const isFuture = date > Date.now();

  const { data, isFetching } = useFindStudentsQuery({
    // _id: { $in: [] },
  });

  if (isFetching || !data?.payload) return null;

  return (
    <List sx={{ width: '100%', maxWidth: '600px' }}>
      {
        data.payload.map((student) => (
        <ListItem key={student._id}>
          <ListItemText primary={student.fullname} />
          <StatusButton />
        </ListItem>
        ))
      }
    </List>
  );
}
