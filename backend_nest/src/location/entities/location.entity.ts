import { Types } from 'mongoose';

export class LocationEntity {
  _id: Types.ObjectId;
  title: string;
  address: string;
  description?: string;
}
