import { ProcessedEvent } from '@aldabil/react-scheduler/types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { ILessonModel } from 'shared/models/ILessonModel';
import { IStudentModel } from 'shared/models/IStudentModel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

interface ExtendedProcessedEvent extends ProcessedEvent {
  payload: {
    lesson: ILessonModel;
    date: number;
  }
}

function ListItemStudent({ student }: { student: IStudentModel }) {
  return (
    <ListItem divider={true}>
      <ListItemText primary={student.fullname} />
    </ListItem>
  );
}

function VisitsButton({ onClick }: { onClick: () => void }) {
  return (
  <Button
    onClick={onClick}
    size="medium"
    color="primary"
    >
    Детали занятия
    </Button>
  );
}

interface IPreviewCard {
  event: ProcessedEvent;
}

export function PreviewCard({ event }: IPreviewCard) {
  const { lesson, date } = (event as ExtendedProcessedEvent).payload;

  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/visits?date=${date}&lessonId=${lesson._id}`);
  };

  return (
    <Card sx={{ minWidth: '300px', maxWidth: '600px' }}>
      <CardActions disableSpacing sx={{ justifyContent: 'center' }}>
        <VisitsButton onClick={onClick} />
      </CardActions>
      <CardContent>
        <List>
          { lesson.students.map(
            (student) => <ListItemStudent key={student._id} student={student} />,
          ) }
        </List>
      </CardContent>
    </Card>
  );
}
