import { ITime } from '../models/ILessonModel';

export function convertTime(time: ITime) {
  return `${time.hh.toString().padStart(2, '0')}:${time.min.toString().padStart(2, '0')}`;
}
