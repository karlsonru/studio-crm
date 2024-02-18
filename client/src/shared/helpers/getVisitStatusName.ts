import { VisitStatus } from '../models/IAttendanceModel';

export function getVisitStatusName(visitStatus?: VisitStatus) {
  switch (visitStatus) {
    case VisitStatus.VISITED:
      return 'Посетил';
    case VisitStatus.POSTPONED_FUTURE:
      return 'К отработке';
    case VisitStatus.POSTPONED_DONE:
      return 'Отработано';
    case VisitStatus.MISSED:
      return 'Пропустил';
    case VisitStatus.SICK:
      return 'Болел';
    case VisitStatus.UNKNOWN:
    default:
      return 'Не отмечен';
  }
}

function getVisitStatusColor(visitStatus?: VisitStatus) {
  const visitStatusColors = {
    [VisitStatus.VISITED]: 'success.main',
    [VisitStatus.POSTPONED_FUTURE]: 'warning.main',
    [VisitStatus.POSTPONED_DONE]: 'success.main',
    [VisitStatus.MISSED]: 'error.main',
    [VisitStatus.SICK]: 'error.main',
    [VisitStatus.UNKNOWN]: 'default',
  };

  return visitStatusColors[visitStatus ?? VisitStatus.UNKNOWN];
}

export function getVisitStatusNameAndColor(visitStatus: VisitStatus) {
  return {
    name: getVisitStatusName(visitStatus),
    color: getVisitStatusColor(visitStatus),
  };
}
