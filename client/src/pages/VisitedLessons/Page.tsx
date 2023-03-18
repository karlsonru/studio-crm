import Input from '@mui/material/Input';
import Stack from '@mui/system/Stack';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { dateValueFormatter } from 'shared/helpers/dateValueFormatter';
import { useMobile } from 'shared/hooks/useMobile';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { setPageTitle } from '../../shared/reducers/appMenuSlice';

export function LessonEvent() {
  return <h1>LessonEvent</h1>;
}

function DaySwitcher({ startDate }: { startDate: number }) {
  const [date, setDate] = useState(startDate);

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
        <Input value={dateString} readOnly={true} size="small" inputProps={{ style: { textAlign: 'center', minWidth: '90px', maxWidth: '7rem' } }} />
      <ArrowForwardIosIcon onClick={nextDate} fontSize="medium" />
    </Stack>
  );
}

export function VisititedLessonsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMobile();

  const date = useParams().date ?? Date.now();
  const isFuture = +date > Date.now();

  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('lessonId');

  useEffect(() => {
    dispatch(setPageTitle('Учёт посещений'));
  }, []);

  return (
    <>
        <header style={{ margin: '1rem 0' }}>
          <DaySwitcher startDate={+date} />
        </header>
    </>
  );
}
