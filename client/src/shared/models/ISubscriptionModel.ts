export interface ISubscriptionTemplateModel {
  _id: string;
  title: string;
  price: number;
  visits: number;
  duration: number;
  isActive: boolean;
}

export interface ISubscriptionTemplateCreate extends Omit<ISubscriptionTemplateModel, '_id'> {}
