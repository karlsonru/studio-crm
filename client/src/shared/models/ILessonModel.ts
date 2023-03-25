import { IUserModel } from './IUserModel';
import { ILocationModel } from './ILocationModel';

export interface ILessonModel {
  _id: string;
  title: string;
  teacher: IUserModel;
  location: ILocationModel;
  day: number;
  timeStart: number;
  timeEnd: number;
  activeStudents: number;
  students: Array<string>,
  dateFrom: number;
  dateTo: number;
  isActive: boolean;
}

export interface ILessonModelCreate extends Omit<ILessonModel, '_id' | 'teacher' | 'location'> {
  teacher: string;
  location: string;
}
