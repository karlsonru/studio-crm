import { Exclude } from 'class-transformer';
import { Types } from 'mongoose';
import { RoleModel } from '../../schemas';

export class UserEntity {
  _id?: Types.ObjectId;
  login: string;

  @Exclude()
  password: string;

  fullname: string;
  role: RoleModel;
  birthday: number;
  phone: number;
}
