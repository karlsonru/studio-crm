import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export class RoleEntity {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  value: string;
}
