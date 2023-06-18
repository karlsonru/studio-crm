import { useSearchParams } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useFindLessonsQuery } from '../../shared/api';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { convertTime } from '../../shared/helpers/convertTime';

export function LessonsList() {
  const currentDateTimestamp = useAppSelector(
    (state) => state.visitsPageReducer.currentDateTimestamp,
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const date = searchParams.get('date');
  const selectedLessonId = searchParams.get('lessonId');

  const { data, isFetching } = useFindLessonsQuery({
    day: new Date(currentDateTimestamp).getDay(),
    dateTo: { $gte: currentDateTimestamp },
    dateFrom: { $lte: currentDateTimestamp },
  }, {
    skip: !date,
  });

  if (!date || isFetching || !data) return null;

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, lessonId: string) => {
    setSearchParams({ date, lessonId });
  };

  return (
    <List sx={{ width: '100%', maxWidth: '360px' }}>
      { [...data]
        .sort((lessonA, lessonB) => {
          if (lessonA.timeStart.hh !== lessonB.timeStart.hh) {
            return lessonA.timeStart.hh - lessonB.timeStart.hh;
          }
          return lessonA.timeStart.min - lessonB.timeStart.min;
        })
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
