export interface IFinanceModel {
  _id: string;
  title: string;
  date: number;
  amount: number;
  type?: string;
  location?: string;
  comment?: string;
}

export interface IFinanceModelCreate extends Omit<IFinanceModel, '_id'> {}
