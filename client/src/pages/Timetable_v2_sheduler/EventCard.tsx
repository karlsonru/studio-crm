import { EventRendererProps, ProcessedEvent } from '@aldabil/react-scheduler/types';
import { format } from 'date-fns';
import Card, { CardProps } from '@mui/material/Card';
import CardHeader, { CardHeaderProps } from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import GroupIcon from '@mui/icons-material/Group';
import Stack, { StackProps } from '@mui/system/Stack';
import Typography from '@mui/material/Typography';
import { ILessonModel } from 'shared/models/ILessonModel';

const cardStyleProps: CardProps = {
  variant: 'outlined',
  sx: {
    height: '100%',
    backgroundColor: '#fff77f',
  },
};

const cardHeaderStyleProps: CardHeaderProps = {
  sx: { padding: '0.25rem' },
  titleTypographyProps: {
    fontWeight: 'bold',
    align: 'left',
    variant: 'caption',
    noWrap: true,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  subheaderTypographyProps: {
    align: 'left',
    variant: 'caption',
  },
};

const stackStyleProps: StackProps = {
  direction: 'row',
  alignItems: 'center',
  spacing: 1,
};

interface ITitleWithIcon {
  title: string;
  amount: number;
}

function TitleWithIcon({ title, amount }: ITitleWithIcon) {
  return (
    <Stack justifyContent="space-between" {...stackStyleProps}>
      <Typography component="h6" fontWeight="bold">
        { title }
      </Typography>
      <Stack {...stackStyleProps} >
        <Typography component="span" fontWeight="bold">
          { amount }
        </Typography>
        <GroupIcon fontSize="small" />
      </Stack>
    </Stack>
  );
}

interface ExtendedProcessedEvent extends ProcessedEvent {
  payload: {
    lesson: ILessonModel;
    date: number;
  }
}

export function EventCard(event: EventRendererProps) {
  const processedEvent = event.event;
  const { lesson } = (processedEvent as ExtendedProcessedEvent).payload;

  return (
    <Card {...event} {...cardStyleProps}>
      <CardHeader
        title={<TitleWithIcon title={lesson.title} amount={lesson.students.length} />}
        subheader={`${format(processedEvent.start, 'HH:mm')} - ${format(processedEvent.end, 'HH:mm')}`}
        {...cardHeaderStyleProps}
      />
      <CardContent sx={{ padding: '0.25rem' }} />
    </Card>
  );
}
