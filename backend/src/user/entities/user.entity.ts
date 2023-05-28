import { Exclude } from 'class-transformer';
import { Types } from 'mongoose';
import { UserRole } from 'src/schemas/user.schema';

export class UserEntity {
  _id?: Types.ObjectId;
  login: string;

  @Exclude()
  password: string;

  fullname: string;
  role: UserRole;
  birthday: number;
  phone: number;
}
