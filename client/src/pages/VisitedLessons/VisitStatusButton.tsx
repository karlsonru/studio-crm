import { useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircleIcon from '@mui/icons-material/Circle';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { visitsPageActions } from '../../shared/reducers/visitsPageSlice';

interface IVisitStatus {
  title: string;
  color: 'error' | 'disabled' | 'action' | 'inherit' | 'secondary' | 'primary' | 'success' | 'info' | 'warning';
  action: string;
}

const VISIT_STATUSES: Array<IVisitStatus> = [
  { title: 'Не отмечен', color: 'disabled', action: 'unknown' },
  { title: 'Посетил', color: 'success', action: 'visited' },
  { title: 'К отработке', color: 'primary', action: 'postponed' },
  { title: 'Пропустил', color: 'error', action: 'missed' },
  { title: 'Болел', color: 'warning', action: 'sick' },
];

interface IVisitStatusButton {
  studentId: string;
  visitStatus?: string
}

export function VisitStatusButton({ studentId, visitStatus }: IVisitStatusButton) {
  const actions = useActionCreators(visitsPageActions);
  const initialStatus = visitStatus ?? 'unknown';

  // проставим сразу в store статус посещения по каждому студенту
  useEffect(() => {
    actions.setVisits({
      student: studentId,
      visitStatus: initialStatus,
    });
  }, []);

  const changeHandler = (event: SelectChangeEvent<string>) => {
    actions.setVisits({
      student: studentId,
      visitStatus: event.target.value,
    });
  };

  return (
    <FormControl sx={{ width: '180px' }}>
      <InputLabel>Сатус</InputLabel>
      <Select
        label="Статус"
        defaultValue={initialStatus}
        onChange={changeHandler}
      >
      {
        VISIT_STATUSES.map((status) => (
          <MenuItem key={status.title} value={status.action}>
            <CircleIcon color={status.color} fontSize="small" sx={{ marginRight: '0.5rem' }} />
            { status.title }
          </MenuItem>
        ))
      }
      </Select>
    </FormControl>
  );
}
