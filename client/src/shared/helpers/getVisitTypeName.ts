import { VisitType } from '../models/ILessonModel';

export function getVisitTypeName(visitType?: VisitType) {
  switch (visitType) {
    case VisitType.REGULAR:
      return 'Постоянно';
    case VisitType.POSTPONED:
      return 'Отработка';
    case VisitType.NEW:
      return 'Новый';
    case VisitType.SINGLE:
      return 'Однократно';
    default:
      return 'Неизвестно';
  }
}
