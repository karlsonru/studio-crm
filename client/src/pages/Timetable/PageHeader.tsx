import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { set } from 'date-fns';
// import { DateSwitcher } from './DateSwitcher';
import { DateSwitcherTimetable } from './DateSwitcherTimetable';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { timetablePageActions } from '../../shared/reducers/timetablePageSlice';
import { useMobile } from '../../shared/hooks/useMobile';

function TextButton({ title, props }: { title: string, props: ButtonProps }) {
  return <Button variant='text' {...props}>{title}</Button>;
}

export function PageHeader() {
  const view = useAppSelector((state) => state.timetablePageReducer.view);
  const isMobile = useMobile();
  const actions = useActionCreators(timetablePageActions);

  const goToday = () => {
    actions.setCurrentDate(
      set(Date.now(), {
        hours: 0, minutes: 0, seconds: 0, milliseconds: 0,
      }).getTime(),
    );
  };

  const changeView = (value: 'day' | 'week') => {
    actions.setView(value);
  };

  return (
    <Stack direction="row" justifyContent="space-between">
      <DateSwitcherTimetable />

      <Stack direction="row">
        <TextButton
          title="Сегодня"
          props={{
            color: 'inherit',
            onClick: () => goToday(),
          }}
        />

        {!isMobile && <TextButton
            title="Неделя"
            props={{
              color: view === 'week' ? 'primary' : 'inherit',
              onClick: () => changeView('week'),
            }}
          />
        }

        {!isMobile && <TextButton
            title="День"
            props={{
              color: view === 'day' ? 'primary' : 'inherit',
              onClick: () => changeView('day'),
            }}
          />
        }
      </Stack>
    </Stack>
  );
}
