import { Types } from 'mongoose';

export class VisitStatusEntity {
  _id: Types.ObjectId;
  title: string;
  action: string;
}
