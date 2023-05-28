import { IUserModel } from './IUserModel';
import { ILessonModel } from './ILessonModel';
import { IStudentModel } from './IStudentModel';

export enum BillingStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
  UNCHARGED = 'uncharged',
}

export enum VisitStatus {
  UNKNOWN = 'unknown',
  VISITED = 'visited',
  POSTPONED = 'postponed',
  MISSED = 'missed',
  SICK = 'sick',
}

interface IVisit {
  student: IStudentModel;
  visitStatus: VisitStatus;
  billingStatus: string;
  subscription: string;
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
