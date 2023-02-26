import { IStudentModel } from './IStudentModel';

export interface ISubscriptionTemplateModel {
  _id: string;
  title: string;
  price: number;
  visits: number;
  duration: number;
  isActive: boolean;
}

export interface ISubscriptionTemplateCreate extends Omit<ISubscriptionTemplateModel, '_id'> {}

export interface ISubscriptionModel {
  _id: string;
  student: IStudentModel;
  template: ISubscriptionTemplateModel;
  price: number;
  visits: number;
  duration: number;
  dateFrom: number;
  dateTo: number;
  paymentMethod: string;
  isActive: boolean;
}

export interface ISubscriptionCreate extends Omit<ISubscriptionModel, '_id' | 'student' | 'template'> {
  student: string;
  template: string;
}
