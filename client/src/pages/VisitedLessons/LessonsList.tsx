import { useSearchParams } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useFindLessonsQuery } from '../../shared/api';
import { useAppSelector } from '../../shared/hooks/useAppSelector';

function convertTime(time: number) {
  const hh = Math.floor(time / 100).toString().padStart(2, '0');
  const min = (time % 100).toString().padStart(2, '0');
  return `${hh}:${min}`;
}

export function LessonsList() {
  const currentDateTimestamp = useAppSelector(
    (state) => state.visitsPageReducer.currentDateTimestamp,
  );

  const { data, isFetching } = useFindLessonsQuery({
    day: new Date(currentDateTimestamp).getDay(),
    dateTo: { $gte: currentDateTimestamp },
    dateFrom: { $lte: currentDateTimestamp },
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedLessonId = searchParams.get('lessonId');

  if (isFetching || !data?.payload) return null;

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, lessonId: string) => {
    setSearchParams({ lessonId });
  };

  return (
    <List sx={{ width: '100%', maxWidth: '360px' }}>
      { [...data.payload]
        .sort((lessonA, lessonB) => lessonA.timeStart - lessonB.timeStart)
        .map(
          (lesson) => <ListItem
            key={lesson._id}
            divider
          >
            <ListItemButton
              selected={lesson._id === selectedLessonId}
              onClick={(event) => handleClick(event, lesson._id)}
            >
              <ListItemText secondary={convertTime(lesson.timeStart)} sx={{ flexGrow: 0 }}/>
              <Divider orientation="vertical" flexItem sx={{ margin: '0 0.5rem' }} />
              <ListItemText primary={lesson.title} secondary={lesson.teacher.fullname} />
            </ListItemButton>
          </ListItem>,
        )}
    </List>
  );
}
