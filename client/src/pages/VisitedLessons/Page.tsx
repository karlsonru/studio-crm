import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '@mui/material/Input';
import Stack from '@mui/system/Stack';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { LessonsList } from './LessonsList';
import { StudentsList } from './StudentsList';
import { dateValueFormatter } from '../../shared/helpers/dateValueFormatter';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { setPageTitle } from '../../shared/reducers/appMenuSlice';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { visitsPageActions } from '../../shared/reducers/visitsPageSlice';
import { LessonInfoCard } from './LessonInfoCard';

function DaySwitcher() {
  const currentDateTimestamp = useAppSelector(
    (state) => state.visitsPageReducer.currentDateTimestamp,
  );
  const actions = useActionCreators(visitsPageActions);
  const navigate = useNavigate();

  const nextDate = () => {
    const nextDayTimestamp = currentDateTimestamp + 86_400_000;
    actions.setCurrentDateTimestamp(nextDayTimestamp);
    navigate(`/visits/${nextDayTimestamp}`);
  };

  const prevDate = () => {
    const prevDayTimestamp = currentDateTimestamp - 86_400_000;
    actions.setCurrentDateTimestamp(prevDayTimestamp);
    navigate(`/visits/${prevDayTimestamp}`);
  };

  const dateString = dateValueFormatter(currentDateTimestamp);

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
    </Stack>
  );
}

export function VisititedLessonsPage() {
  const dispatch = useAppDispatch();
  const { date } = useParams();
  const navigate = useNavigate();
  const actions = useActionCreators(visitsPageActions);

  useEffect(() => {
    dispatch(setPageTitle('Учёт посещений'));

    // если никакой даты передано при переходе не было - ставим сейчас
    if (date === undefined) {
      actions.setCurrentDateTimestamp(Date.now());
      navigate(`/visits/${Date.now()}`);
    } else {
    // иначе дату берём из параметров
      actions.setCurrentDateTimestamp(+date);
    }
  }, []);

  return (
    <>
      <header style={{ margin: '1rem 0' }}>
        <DaySwitcher />
      </header>
      <Stack direction="row" flexWrap="wrap">
        <LessonsList />
        <Stack>
          <LessonInfoCard />
          <StudentsList />
        </Stack>
      </Stack>
    </>
  );
}
