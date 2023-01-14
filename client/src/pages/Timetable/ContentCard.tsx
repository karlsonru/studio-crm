import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import GroupIcon from '@mui/icons-material/Group';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { ILessonModel } from '../../shared/models/ILessonModel';
import { getReadbleTime } from '../../shared/helpers/getReadableTime';

function convertToMinutes(time: number) {
  const hours = Math.floor(time / 100) - 9;
  const minutes = Math.round(time % 100);
  return hours * 60 + minutes;
}

export function TimetableLessonCard({ lessonCardDetails }: { lessonCardDetails: ILessonModel }) {
  const {
    title, teacher, timeStart, timeEnd, activeStudents,
  } = lessonCardDetails;

  const isMobile = useMediaQuery('(max-width: 767px)');

  const timeStartReadable = getReadbleTime(timeStart);
  const timeEndReadable = getReadbleTime(timeEnd);

  const fontSize = isMobile ? '1rem' : '0.85rem!important';
  const duration = (convertToMinutes(timeEnd) - convertToMinutes(timeStart));
  const shift = isMobile ? 0 : convertToMinutes(timeStart);

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
        <Stack spacing={0}>

          <Stack direction='row' spacing={0} justifyContent='space-between' p='4px' whiteSpace='nowrap'>
            <Typography component='span' fontSize={ fontSize }>{timeStartReadable} - {timeEndReadable}</Typography>
            <Stack direction='row' spacing={0}>
              <GroupIcon sx={{ marginBottom: '-4px', fontSize: { fontSize } }}/>
              <Typography component='span' m={'0px 4px'} fontSize={ fontSize }>{activeStudents}</Typography>
            </Stack>
          </Stack>

          <Typography paragraph m='0px' p='4px' textOverflow='ellipsis' whiteSpace='nowrap' fontSize={ fontSize }>{teacher.name}</Typography>

        </Stack>
      </CardContent>

    </Card>
  );
}
