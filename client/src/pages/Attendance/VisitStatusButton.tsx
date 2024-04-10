import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircleIcon from '@mui/icons-material/Circle';
import { VisitStatus } from '../../shared/models/IAttendanceModel';
import { VisitType } from '../../shared/models/ILessonModel';
import { getVisitStatusName } from '../../shared/helpers/getVisitStatusName';
import { useMobile } from '../../shared/hooks/useMobile';

// eslint-disable-next-line
type color = 'error' | 'disabled' | 'action' | 'inherit' | 'secondary' | 'primary' | 'success' | 'info' | 'warning';

const visitStatusWithColor: Record<VisitStatus, color> = {
  [VisitStatus.UNKNOWN]: 'disabled',
  [VisitStatus.VISITED]: 'success',
  [VisitStatus.POSTPONED_FUTURE]: 'primary',
  [VisitStatus.MISSED]: 'error',
  [VisitStatus.SICK]: 'warning',
  [VisitStatus.POSTPONED_DONE]: 'success',
};

interface IVisitStatusButton {
  studentId: string;
  visitStatus?: VisitStatus;
  visitType: VisitType;
  isLocked: boolean;
}

function getVisitStatusesByVisitType(visitType: VisitType) {
  if (visitType === VisitType.POSTPONED) {
    return [VisitStatus.UNKNOWN, VisitStatus.POSTPONED_DONE, VisitStatus.MISSED];
  }

  return Object.keys(visitStatusWithColor).slice(0, -1) as Array<VisitStatus>;
}

export function VisitStatusButton({
  studentId, visitStatus, visitType, isLocked,
}: IVisitStatusButton) {
  const isMobile = useMobile();
  const initialStatus = visitStatus ?? VisitStatus.UNKNOWN;

  const keys = getVisitStatusesByVisitType(visitType) as Array<VisitStatus>;

  return (
    <FormControl sx={{
      width: isMobile ? '135px' : '180px',
      flexShrink: 0,
    }}>
      <InputLabel>Сатус</InputLabel>
      <Select
        name={studentId}
        label="Статус"
        defaultValue={initialStatus}
        disabled={isLocked}
      >
      { keys.map((status) => <MenuItem
            key={status}
            value={status}
          >
            <CircleIcon
              fontSize="small"
              color={visitStatusWithColor[status]}
              sx={{ marginRight: '0.5rem' }}
            />
            { getVisitStatusName(status) }
          </MenuItem>)
      }
      </Select>
    </FormControl>
  );
}
