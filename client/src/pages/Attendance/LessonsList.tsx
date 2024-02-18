import React from 'react';
import { useSearchParams } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useAppSelector } from 'shared/hooks/useAppSelector';
import { convertTime } from '../../shared/helpers/convertTime';
import { ILessonModel } from '../../shared/models/ILessonModel';

function ListItemLesson({ lesson }: { lesson: ILessonModel }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedLessonId = searchParams.get('lessonId');

  const searchDateTimestamp = useAppSelector(
    (state) => state.attendancePageReducer.searchDateTimestamp,
  );

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, lessonId: string) => {
    const date = new Date(searchDateTimestamp);

    setSearchParams({
      year: date.getFullYear().toString(),
      month: (date.getMonth() + 1).toString(),
      day: date.getDate().toString(),
      lessonId,
    });
  };

  return (
    <ListItem divider>
      <ListItemButton
        selected={lesson._id === selectedLessonId}
        onClick={(event) => handleClick(event, lesson._id)}
      >
        <ListItemText secondary={convertTime(lesson.timeStart)} sx={{ flexGrow: 0 }}/>
        <Divider orientation="vertical" flexItem sx={{ margin: '0 0.5rem' }} />
        <ListItemText primary={lesson.title} secondary={lesson.teacher.fullname} />
      </ListItemButton>
    </ListItem>
  );
}

export const LessonsList = React.memo(({ lessons }: { lessons: Array<ILessonModel> }) => (
    <List sx={{ width: '100%', maxWidth: '360px' }}>
      { lessons.map((lesson) => <ListItemLesson key={lesson._id} lesson={lesson} />) }
    </List>
));
