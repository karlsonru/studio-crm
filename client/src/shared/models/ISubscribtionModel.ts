export interface ISubscribtionTemplateModel {
  _id: string;
  title: string;
  price: string;
  visits: number;
  duration: number;
  isActive: boolean;
}

export interface ISubscribtionTemplateCreate extends Omit<ISubscribtionTemplateModel, '_id'> {}
