import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircleIcon from '@mui/icons-material/Circle';
import { VisitStatus } from '../../shared/models/IAttendanceModel';

interface IVisitStatus {
  title: string;
  color: 'error' | 'disabled' | 'action' | 'inherit' | 'secondary' | 'primary' | 'success' | 'info' | 'warning';
  action: VisitStatus;
}

const VISIT_STATUSES: Array<IVisitStatus> = [
  { title: 'Не отмечен', color: 'disabled', action: VisitStatus.UNKNOWN },
  { title: 'Посетил', color: 'success', action: VisitStatus.VISITED },
  { title: 'К отработке', color: 'primary', action: VisitStatus.POSTPONED },
  { title: 'Пропустил', color: 'error', action: VisitStatus.MISSED },
  { title: 'Болел', color: 'warning', action: VisitStatus.SICK },
];

interface IVisitStatusButton {
  studentId: string;
  visitStatus?: VisitStatus;
}

export function VisitStatusButton({ studentId, visitStatus }: IVisitStatusButton) {
  const initialStatus = visitStatus ?? VisitStatus.UNKNOWN;

  return (
    <FormControl sx={{ width: '180px' }}>
      <InputLabel>Сатус</InputLabel>
      <Select
        name={studentId}
        label="Статус"
        defaultValue={initialStatus}
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
