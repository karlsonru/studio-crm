import { IUserModel } from './IUserModel';
import { ILessonModel, VisitType } from './ILessonModel';
import { IStudentModel } from './IStudentModel';

export enum PaymentStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
  UNCHARGED = 'uncharged',
}

export enum VisitStatus {
  UNKNOWN = 'unknown',
  VISITED = 'visited',
  MISSED = 'missed',
  SICK = 'sick',
  POSTPONED_FUTURE = 'postponed_future',
  POSTPONED_DONE = 'postponed_done',
}

export enum AttendanceType {
  DONE = 'done',
  FUTURE = 'future',
}

export interface IVisit {
  student: IStudentModel;
  visitStatus: VisitStatus;
  paymentStatus: PaymentStatus;
  visitType: VisitType;
  subscription: string;
  visitInstead?: string;
}

interface IVisitCreate extends Omit<IVisit, 'student' | 'subscription' | 'paymentStatus'> {
  student: string;
}

export interface IAttendanceModel {
  _id: string;
  lesson: ILessonModel;
  teacher: IUserModel;
  type: AttendanceType;
  day: number;
  date: number; // UTC Timestamp
  students: Array<IVisit>,
}

export interface IAttendanceModelCreate extends Omit<IAttendanceModel, '_id' | 'lesson' | 'teacher' | 'students' | 'date' | 'type'> {
  lesson: string;
  teacher: string;
  students: Array<IVisitCreate>
  year: number;
  month: number;
  weekday: number;
}
