import { useNavigate } from 'react-router-dom';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Button from '@mui/material/Button';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import { dateValueFormatter } from '../../shared/helpers/dateValueFormatter';
import { convertTime } from '../../shared/helpers/convertTime';
import { ILessonModel } from '../../shared/models/ILessonModel';
import { CardWrapper } from '../../shared/components/CardWrapper';
import { useAppSelector } from '../../shared/hooks/useAppSelector';

function AddListItemWIthIcon({ text, icon }: { text: string, icon: React.ReactElement }) {
  return (
    <ListItem>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
}

export function LessonDetails({ lesson }: { lesson: ILessonModel }) {
  const searchDateTimestamp = useAppSelector(
    (state) => state.attendancePageReducer.searchDateTimestamp,
  );

  const dateField = `${dateValueFormatter(searchDateTimestamp)} c ${convertTime(lesson.timeStart)} до ${convertTime(lesson.timeEnd)}`;
  const navigate = useNavigate();

  return (
    <CardWrapper extraStyle={{ height: 'max-content' }}>
      <CardHeader
        title={lesson.title}
        titleTypographyProps={{ variant: 'h6' }}
        subheader={ <Button onClick={() => navigate(`/lessons/${lesson._id}`)}>К занятию</Button> }
      />
      <CardContent >
        <List>
          <AddListItemWIthIcon text={lesson.location.address} icon={<LocationOnOutlinedIcon />} />
          <AddListItemWIthIcon text={dateField} icon={<ScheduleOutlinedIcon />} />
        </List>
      </CardContent>
    </CardWrapper>
  );
}
