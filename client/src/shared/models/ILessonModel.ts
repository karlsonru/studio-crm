import { IUserModel } from './IUserModel';
import { ILocationModel } from './ILocationModel';
import { IStudentModel } from './IStudentModel';

export interface ILessonModel {
  _id: string;
  title: string;
  teacher: IUserModel;
  location: ILocationModel;
  day: number;
  timeStart: number;
  timeEnd: number;
  activeStudents: number;
  students: Array<IStudentModel>,
  dateFrom: number;
  dateTo: number;
  isActive: boolean;
}

export interface ILessonModelCreate extends Omit<ILessonModel, '_id' | 'teacher' | 'location' | 'students'> {
  teacher: string;
  location: string;
  students: Array<string>;
}
