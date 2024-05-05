import { ILocationModel } from './ILocationModel';

export interface IFinanceModel {
  _id: string;
  title: string;
  date: number;
  amount: number;
  categoryName?: string;
  location?: Pick<ILocationModel, '_id' | 'title'>;
  comment?: string;
}

export interface IFinanceModelCreate extends Omit<IFinanceModel, '_id' | 'location'> {
  location: string;
}
