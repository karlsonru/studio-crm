import { useMemo, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardHeader, { CardHeaderProps } from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import GroupIcon from '@mui/icons-material/Group';
import { differenceInMinutes } from 'date-fns';
import { ContentCardPreview } from './ContentCardPreview';
import { ILessonModel, ITime } from '../../shared/models/ILessonModel';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { convertTime } from '../../shared/helpers/convertTime';

const CARD_STYLE = {
  left: 0,
  width: '100%',
  border: '1px solid black',
  cursor: 'pointer',
};

const CARD_STYLE_MOBILE = {
  position: 'static',
  top: 'auto',
  height: 'auto',
  zIndex: 'auto',
};

const CARD_HEADER_PROPS: CardHeaderProps = {
  sx: {
    padding: '0.25rem',
    backgroundColor: 'lightyellow',
  },
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

const STACK_PROPS: StackProps = {
  direction: 'row',
  alignItems: 'center',
  spacing: 1,
};

function calculateDuration(timeStart: ITime, timeEnd: ITime) {
  return differenceInMinutes(
    new Date(1970, 0, 1, timeStart.hh, timeStart.min),
    new Date(1970, 0, 1, timeEnd.hh, timeEnd.min),
  );
}

interface ITitleWithIcon {
  title: string;
  amount: number;
}

function TitleWithIcon({ title, amount }: ITitleWithIcon) {
  return (
    <Stack justifyContent="space-between" {...STACK_PROPS}>
      <Typography component="h6" fontWeight="bold">
        { title }
      </Typography>
      <Stack {...STACK_PROPS} >
        <Typography component="span" fontWeight="bold">
          { amount }
        </Typography>
        <GroupIcon fontSize="small" />
      </Stack>
    </Stack>
  );
}

function formatCardContent(lesson: ILessonModel, step: number, view: 'day' | 'week') {
  const content = {
    title: lesson.title,
    timeStart: convertTime(lesson.timeStart),
    timeEnd: convertTime(lesson.timeEnd),
    students: lesson.students.length,
  };

  // для размещения в виде Дня подходят авто настройки для стилей
  if (view === 'day') {
    return {
      content,
      style: CARD_STYLE_MOBILE,
    };
  }

  // для размещения в виде Недели вычисляем размещение каждой карточки

  const duration = calculateDuration(lesson.timeEnd, lesson.timeStart);

  // мультипликатор насколько нужно смещать карточку в зависимости от шага времени
  const mul = Math.floor(60 / step);

  const topMove = lesson.timeStart.min >= step ? lesson.timeStart.min - step : lesson.timeStart.min;

  return {
    content,
    style: {
      position: 'absolute',
      top: `${topMove * mul}px`,
      height: `${duration * mul}px`,
      zIndex: 1,
    },
  };
}

interface IContentCard {
  lesson: ILessonModel;
  step?: number;
  date: number;
}

export function ContentCard({ lesson, step, date }: IContentCard) {
  const view = useAppSelector((state) => state.timetablePageReducer.view);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const showPreview = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const formattedContent = useMemo(
    () => formatCardContent(lesson, step ?? 0, view),
    [view, lesson._id, step],
  );

  const {
    title, timeStart, timeEnd, students,
  } = formattedContent.content;

  const goVisitsPage = () => {
    navigate(`/visits?lessonId=${lesson._id}&date=${date}`);
  };

  return (
    <>
      <Card
        onMouseEnter={showPreview}
        onMouseLeave={handleClose}
        onDoubleClick={goVisitsPage}
        variant="outlined"
        sx={{ ...formattedContent.style, ...CARD_STYLE }}
      >
        <CardHeader
          title={<TitleWithIcon title={title} amount={students} />}
          subheader={`${timeStart} - ${timeEnd}`}
          {...CARD_HEADER_PROPS}
        />
        <CardContent sx={{ padding: '0.25rem' }} />
      </Card>
      <ContentCardPreview
        anchorEl={anchorEl}
        handleClose={handleClose}
        content={lesson.students.map((student) => student.fullname)}
      />
    </>
  );
}
