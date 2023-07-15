import { ILessonModel } from './ILessonModel';
import { IStudentModel } from './IStudentModel';

export interface ISubscriptionTemplateModel {
  _id: string;
  title: string;
  price: number;
  visits: number;
  // duration: number;
}

export interface ISubscriptionTemplateCreate extends Omit<ISubscriptionTemplateModel, '_id'> {}

export interface ISubscriptionModel {
  _id: string;
  student: IStudentModel;
  lessons: Array<ILessonModel>;
  price: number;
  visitsTotal: number;
  visitsLeft: number;
  visitsPostponed: number;
  dateFrom: number;
  dateTo: number;
  paymentMethod: string;
}

export interface ISubscriptionCreate extends Omit<ISubscriptionModel, '_id' | 'student' | 'template' | 'lessons'> {
  student: string;
  lessons: Array<string>;
}
