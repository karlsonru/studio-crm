import { IUserModel } from './IUserModel';
import { IStudentModel } from './IStudentModel';
import { ILessonModel } from './ILessonModel';
import { IVisit } from '../reducers/visitsPageSlice';

export interface IVisitModel {
  _id: string;
  lesson: ILessonModel;
  teacher: IUserModel;
  day: number;
  date: number;
  students: Array<IStudentModel>,
}

export interface IVisitModelCreate extends Omit<IVisitModel, '_id' | 'lesson' | 'teacher' | 'students'> {
  lesson: string;
  teacher: string;
  students: Array<IVisit>
}
