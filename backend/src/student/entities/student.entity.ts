import { Types } from 'mongoose';
import { IStudentContact } from '../../schemas/student.schema';

export class StudentEntity {
  _id: Types.ObjectId;
  fullname: string;
  sex: string;
  birthday: number;
  contacts: IStudentContact[];
  source?: string;
}
