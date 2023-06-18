import { IUserModel } from './IUserModel';
import { ILocationModel } from './ILocationModel';
import { IStudentModel } from './IStudentModel';

export interface ITime {
  hh: number;
  min: number;
}

export enum VisitType {
  PERMANENT = 'permament',
  TEMPORARY = 'temporary',
}

export interface IVisitingStudent {
  student: IStudentModel;
  date: null | number;
  visitType: VisitType;
}

export interface ILessonModel {
  _id: string;
  title: string;
  teacher: IUserModel;
  location: ILocationModel;
  day: number;
  timeStart: ITime;
  timeEnd: ITime;
  activeStudents: number;
  students: Array<IVisitingStudent>,
  dateFrom: number;
  dateTo: number;
  isActive: boolean;
}

interface IVisitingStudentCreate extends Omit<IVisitingStudent, 'student'> {
  student: string;
}

export interface ILessonModelCreate extends Omit<ILessonModel, '_id' | 'teacher' | 'location' | 'students'> {
  teacher: string;
  location: string;
  students: Array<IVisitingStudentCreate>;
}
