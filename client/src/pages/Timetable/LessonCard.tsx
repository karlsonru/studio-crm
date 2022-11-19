import { Card, CardContent, CardHeader } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import { Box } from '@mui/system';

interface ILessonCardDetails {
  [index: string]: string | number | any;
}

interface ILessonCard {
  cardDetails: ILessonCardDetails;
}

export function LessonCard({ cardDetails }: ILessonCard) {
  const {
    title, teacher, timeStart, timeEnd, activeStudents,
  } = cardDetails;

  const start = timeStart.toString().padStart(4, '0');
  const timeStartReadable = `${start.slice(0, 2)}:${start.slice(2)}`;

  const end = timeEnd.toString().padStart(4, '0');
  const timeEndReadable = `${end.slice(0, 2)}:${end.slice(2)}`;

  const subHeader = <Box sx={{ whiteSpace: 'nowrap' }}>
      <GroupIcon sx={{
        marginBottom: '-4px',
        fontSize: 'large',
      }}/>
      <span style={{ margin: '0px 4px' }}>{activeStudents}</span>
  </Box>;

  return (
    <Card variant='outlined' sx={{
      height: '102px',
      textOverflow: 'ellipsis',
    }}>
      <CardHeader
        width='100%'
        title={title}
        titleTypographyProps={{
          fontSize: '1rem',
          textAlign: 'center',
          backgroundColor: '#fff000',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        subheader={subHeader}
        subheaderTypographyProps={{
          textAlign: 'end',
        }}
        sx={{
          padding: '0px',
          maring: '0px',
        }}
      >
      </CardHeader>
      <CardContent>
        <p style={{
          fontSize: '1rem',
          margin: '0px',
          padding: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>{teacher.name}</p>
        <p style={{
          fontSize: '1rem',
          margin: '0px',
          padding: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          <span>{timeStartReadable} - {timeEndReadable}</span>
        </p>
      </CardContent>
    </Card>
  );
}
