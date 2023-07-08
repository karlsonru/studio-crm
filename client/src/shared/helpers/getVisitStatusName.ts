import { VisitStatus } from '../models/IAttendanceModel';

export function getVisitStatusName(visitStatus?: VisitStatus) {
  switch (visitStatus) {
    case VisitStatus.VISITED:
      return 'Посетил';
    case VisitStatus.POSTPONED:
      return 'К отработке';
    case VisitStatus.MISSED:
      return 'Пропустил';
    case VisitStatus.SICK:
      return 'Болел';
    case VisitStatus.UNKNOWN:
    default:
      return 'Не отмечен';
  }
}
