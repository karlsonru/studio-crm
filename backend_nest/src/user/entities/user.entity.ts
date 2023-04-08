import { Exclude } from 'class-transformer';
import { Types } from 'mongoose';
import { Role } from 'src/schemas/role.schema';

export class UserEntity {
  _id?: Types.ObjectId;
  login: string;

  @Exclude()
  password: string;

  fullname: string;
  role: Role;
  birthday: number;
  phone: number;
}
