import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  useMediaQuery,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import { Box } from '@mui/system';

function convertToMinutes(time: number) {
  const hours = Math.floor(time / 100) - 9;
  const minutes = Math.round(time % 100);
  return hours * 60 + minutes;
}

function convertToReadbleTime(time: number) {
  const timeString = time.toString().padStart(4, '0');
  const hours = timeString.slice(0, 2);
  const minutes = timeString.slice(2);
  return `${hours}:${minutes}`;
}

export interface ILessonModel {
  _id: string;
  title: string;
  day: number;
  teacher: {
    name: string;
    _id: string;
  };
  timeStart: number;
  timeEnd: number;
  activeStudents: number;
  dateFrom: number;
  dateTo: number;
}

export function LessonCard({ lessonCardDetails }: { lessonCardDetails: ILessonModel }) {
  const {
    title, teacher, timeStart, timeEnd, activeStudents,
  } = lessonCardDetails;

  const isMobile = useMediaQuery('(max-width: 767px)');

  const timeStartReadable = convertToReadbleTime(timeStart);
  const timeEndReadable = convertToReadbleTime(timeEnd);

  const fontSize = isMobile ? '1rem' : '0.85rem!important';
  const duration = (convertToMinutes(timeEnd) - convertToMinutes(timeStart));
  const shift = isMobile ? 0 : convertToMinutes(timeStart);

  const subHeader = <Grid
    container
    wrap='nowrap'
    justifyContent='space-between'
    sx={{
      padding: '4px',
      whiteSpace: 'nowrap',
    }}>
      <span>{timeStartReadable} - {timeEndReadable}</span>
      <Box>
        <GroupIcon sx={{ marginBottom: '-4px', fontSize: { fontSize } }}/>
        <span style={{ margin: '0px 4px' }}>{activeStudents}</span>
      </Box>
  </Grid>;

  return (
    <Card
      variant='outlined'
      sx={{
        position: isMobile ? 'static' : 'absolute',
        top: isMobile ? '0px' : `${shift * 2 + 48}px`,
        height: isMobile ? 'auto' : `${duration * 2}px`,
        minHeight: '60px',
        fontSize: { fontSize },
        width: 'calc(100% - 8px)',
        boxSizing: 'border-box',
        margin: '0',
        overflow: 'hidden',
      }}>
      <CardHeader
        title={title}
        titleTypographyProps={{
          fontSize: { fontSize },
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        sx={{
          borderTop: '3px solid #fff000',
          padding: '0px',
          overflow: 'hidden',
        }}
        >
      </CardHeader>
      <CardContent sx={{
        margin: 0,
        padding: '0 4px',
        overflow: 'hidden',
      }}>
        <Grid container direction='column' justifyItems='space-between'>
          {subHeader}
          <p style={{
            margin: '0px',
            padding: '4px',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {teacher.name}
          </p>
        </Grid>
      </CardContent>
    </Card>
  );
}
