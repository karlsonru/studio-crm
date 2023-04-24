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
      { title }
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
  payload: ILessonModel;
}

export function EventCard(event: EventRendererProps) {
  const lesson = event.event as ExtendedProcessedEvent;

  return (
    <Card {...event} {...cardStyleProps}>
      <CardHeader
        title={<TitleWithIcon title={lesson.title} amount={lesson.payload?.students.length} />}
        subheader={`${format(lesson.start, 'HH:mm')} - ${format(lesson.end, 'HH:mm')}`}
        {...cardHeaderStyleProps}
      />
      <CardContent sx={{ padding: '0.25rem' }} />
    </Card>
  );
}
