import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircleIcon from '@mui/icons-material/Circle';
import { VisitStatus } from '../../shared/models/IAttendanceModel';
import { getVisitStatusName } from '../../shared/helpers/getVisitStatusName';

const VISIT_STATUSES: Array<{
  action: VisitStatus;
  color: 'error' | 'disabled' | 'action' | 'inherit' | 'secondary' | 'primary' | 'success' | 'info' | 'warning';
}> = [
  { action: VisitStatus.UNKNOWN, color: 'disabled' },
  { action: VisitStatus.VISITED, color: 'success' },
  { action: VisitStatus.POSTPONED, color: 'primary' },
  { action: VisitStatus.MISSED, color: 'error' },
  { action: VisitStatus.SICK, color: 'warning' },
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
          <MenuItem key={status.action} value={status.action}>
            <CircleIcon color={status.color} fontSize="small" sx={{ marginRight: '0.5rem' }} />
            { getVisitStatusName(status.action) }
          </MenuItem>
        ))
      }
      </Select>
    </FormControl>
  );
}
