import { Types } from 'mongoose';

export class SubscriptionTemplateEntity {
  _id: Types.ObjectId;
  title: string;
  price: number;
  visits: number;
  duration: number;
}
