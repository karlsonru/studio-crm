export interface IVisitStatusModel {
  _id: string;
  title: string;
  action?: string;
}

export interface IVisitStatusCreate extends Omit<IVisitStatusModel, '_id'> {}
