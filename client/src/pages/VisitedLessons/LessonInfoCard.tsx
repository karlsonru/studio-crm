import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useGetLessonQuery } from '../../shared/api';
import { dateValueFormatter } from '../../shared/helpers/dateValueFormatter';

function convertTime(time: number) {
  const hh = Math.floor(time / 100).toString().padStart(2, '0');
  const min = (time % 100).toString().padStart(2, '0');
  return `${hh}:${min}`;
}

function AddListItem({ text, icon }: { text: string, icon: React.ReactElement }) {
  return (
    <ListItem>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
    <ListItemText primary={text} />
    </ListItem>
  );
}

export function LessonInfoCard() {
  const [searchParams] = useSearchParams();
  const selectedLessonId = searchParams.get('lessonId') ?? '';

  const currentDateTimestamp = useAppSelector(
    (state) => state.visitsPageReducer.currentDateTimestamp,
  );

  const { data, isFetching } = useGetLessonQuery(selectedLessonId, {
    skip: !selectedLessonId,
  });

  if (!selectedLessonId || isFetching || !data?.payload) return null;

  const lesson = data.payload;

  const dateField = `${dateValueFormatter(currentDateTimestamp)} c ${convertTime(lesson.timeStart)} до ${convertTime(lesson.timeEnd)}`;

  return (
    <Card sx={{ maxHeight: '250px' }}>
      <CardHeader title={lesson.title} />
      <CardContent>
        <List>
          <AddListItem text={lesson.location.address} icon={<LocationOnOutlinedIcon />} />
          <AddListItem text={dateField} icon={<ScheduleOutlinedIcon />} />
          <AddListItem text={`Посетило 0 из ${lesson.activeStudents}`} icon={<PersonOutlineOutlinedIcon />} />
        </List>
      </CardContent>
    </Card>
  );
}
