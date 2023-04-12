import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Input from '@mui/material/Input';
import Stack from '@mui/system/Stack';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Typography from '@mui/material/Typography';
import { LessonsList } from './LessonsList';
import { LessonInfo } from './LessonInfo';
import { dateValueFormatter } from '../../shared/helpers/dateValueFormatter';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { setPageTitle } from '../../shared/reducers/appMenuSlice';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { visitsPageActions } from '../../shared/reducers/visitsPageSlice';
import { getDayName } from '../../shared/helpers/getDayName';
import { getTodayTimestamp } from '../../shared/helpers/getTodayTimestamp';

function DaySwitcher() {
  const actions = useActionCreators(visitsPageActions);
  const [searchParams, setSearchParams] = useSearchParams();
  const [date, setDate] = useState(+(searchParams.get('date') ?? getTodayTimestamp()));

  useEffect(() => {
    actions.setCurrentDateTimestamp(date);
    setSearchParams({ date: date.toString() });
  }, [date]);

  const nextDate = () => {
    setDate(() => date + 86_400_000);
  };

  const prevDate = () => {
    setDate(() => date - 86_400_000);
  };

  const dateString = dateValueFormatter(date);

  return (
    <Stack direction="row" alignItems="center" justifyContent="start">
      <ArrowBackIosNewIcon onClick={prevDate} fontSize="medium" />
        <Input
          value={dateString}
          readOnly={true}
          size="small"
          inputProps={{
            style: {
              textAlign: 'center',
              minWidth: '90px',
              maxWidth: '7rem',
            },
          }}
        />
      <ArrowForwardIosIcon onClick={nextDate} fontSize="medium" />
      <Typography variant="h6" marginLeft="1rem">
        { getDayName(new Date(date).getDay()) }
      </Typography>
    </Stack>
  );
}

export function VisititedLessonsPage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const actions = useActionCreators(visitsPageActions);

  useEffect(() => {
    dispatch(setPageTitle('Учёт посещений'));
  }, []);

  useEffect(() => {
    const date = searchParams.get('date');

    // если даты нет в search params - добавим самостоятельно текущий день
    if (!date) {
      setSearchParams({ date: getTodayTimestamp().toString() });
      actions.setCurrentDateTimestamp(getTodayTimestamp());
    // если есть - обновим state чтобы дата в state соответствовала дате в params
    } else {
      actions.setCurrentDateTimestamp(+date);
    }
  });

  return (
    <>
      <header style={{ margin: '1rem 0' }}>
        <DaySwitcher />
      </header>
      <Stack direction="row" flexWrap="wrap" spacing={2} >
        <LessonsList />
        <LessonInfo />
      </Stack>
    </>
  );
}
