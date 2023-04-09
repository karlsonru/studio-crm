import { IUserModel } from './IUserModel';
import { ILessonModel } from './ILessonModel';
import { IStudentModel } from './IStudentModel';

interface IVisit {
  student: IStudentModel;
  visitStatus: string;
}

export interface IVisitModel {
  _id: string;
  lesson: ILessonModel;
  teacher: IUserModel;
  day: number;
  date: number;
  students: Array<IVisit>,
}

export interface IVisitModelCreate extends Omit<IVisitModel, '_id' | 'lesson' | 'teacher' | 'students'> {
  lesson: string;
  teacher: string;
  students: Array<Record<'student' | 'visitStatus', string>>
}
