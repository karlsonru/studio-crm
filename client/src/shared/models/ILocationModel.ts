export interface ILocationModel {
  _id: string;
  title: string;
  description: string;
  address: string;
  isActive: boolean;
}

export interface ILocationModelCreate extends Omit<ILocationModel, '_id'> {}
