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
import { dateValueFormatter } from '../../shared/helpers/dateValueFormatter';
import { convertTime } from '../../shared/helpers/convertTime';
import { ILessonModel } from '../../shared/models/ILessonModel';

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

interface ILessonDetails {
  lesson: ILessonModel;
  dateTimestamp: number;
  visitedStudents: number;
}

export function LessonDetails({ lesson, dateTimestamp, visitedStudents }: ILessonDetails) {
  const dateField = `${dateValueFormatter(dateTimestamp)} c ${convertTime(lesson.timeStart)} до ${convertTime(lesson.timeEnd)}`;

  return (
    <Card sx={{ maxHeight: '250px' }}>
      <CardHeader title={lesson.title} />
      <CardContent>
        <List>
          <AddListItem text={lesson.location.address} icon={<LocationOnOutlinedIcon />} />
          <AddListItem text={dateField} icon={<ScheduleOutlinedIcon />} />
          <AddListItem text={`Посетило ${visitedStudents} из ${lesson.students.length}`} icon={<PersonOutlineOutlinedIcon />} />
        </List>
      </CardContent>
    </Card>
  );
}
